//@CustomCode
import { IdType, IdDefault } from '@app/models/i-key-model';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ITdList } from '@app-models/entities/data/i-td-list';
import { ITdTask } from '@app-models/entities/data/i-td-task';
import { TdListBaseListComponent }from '@app/components/entities/data/td-list-base-list.component';
import { TdListEditComponent }from '@app/components/entities/data/td-list-edit.component';
import { TdListService } from '@app-services/http/entities/data/td-list-service';
import { TdTaskService } from '@app-services/http/entities/data/td-task-service';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  selector:'app-td-list-list',
  standalone: true,
  imports: [ CommonModule, FormsModule, TranslateModule, DragDropModule ],
  templateUrl: './td-list-list.component.html',
  styleUrl: './td-list-list.component.css'
})
export class TdListListComponent extends TdListBaseListComponent {
  // cache of expanded states and tasks
  public expanded: Record<number, boolean> = {};
  public tasksByListId: Record<number, ITdTask[]> = {};
  public loadingTasks: Record<number, boolean> = {};
  public newTaskByListId: Record<number, ITdTask | undefined> = {};
  public editingTaskCopyById: Record<number, ITdTask | undefined> = {};
  public savingByListId: Record<number, boolean> = {};

  // sorting
  public sortOption: 'nameAsc' | 'nameDesc' | 'createdDesc' | 'createdAsc' = 'nameAsc';

  constructor(protected override dataAccessService: TdListService, private taskService: TdTaskService)
  {
    super(dataAccessService);
  }
  override ngOnInit(): void {
    this._queryParams.filter = 'name.ToLower().Contains(@0) OR description.ToLower().Contains(@0)';
    this.reloadData();
  }
  protected override getItemKey(item: ITdList): IdType {
    return item?.id || IdDefault;
  }
  override get pageTitle(): string {
    return 'TdLists';
  }
  override getEditComponent() {
    return TdListEditComponent;
  }
  protected override sortData(items: ITdList[]): ITdList[] {
    const sorted = [...items];
    switch (this.sortOption) {
      case 'nameAsc':
        sorted.sort((a,b) => (a.name||'').localeCompare(b.name||''));
        break;
      case 'nameDesc':
        sorted.sort((a,b) => (b.name||'').localeCompare(a.name||''));
        break;
      case 'createdDesc':
        sorted.sort((a,b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
        break;
      case 'createdAsc':
        sorted.sort((a,b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime());
        break;
    }
    return sorted;
  }
//@CustomCodeBegin
  public getDropId(list: ITdList): string {
    return `list-${list.id}`;
  }
  public getConnectedDropIds(current: ITdList): string[] {
    return Object.keys(this.expanded)
      .filter(k => this.expanded[+k])
      .map(k => `list-${k}`)
      .filter(id => id !== this.getDropId(current));
  }

  public dropList(event: CdkDragDrop<ITdList[]>) {
    moveItemInArray(this.dataItems, event.previousIndex, event.currentIndex);
  }
  public dropTask(list: ITdList, event: CdkDragDrop<ITdTask[]>) {
    const targetId = list.id as number;
    const targetArray = (event.container.data ?? []) as ITdTask[];

    if (event.previousContainer === event.container) {
      moveItemInArray(targetArray, event.previousIndex, event.currentIndex);
      this.tasksByListId[targetId] = [...targetArray];
    } else {
      const sourceArray = (event.previousContainer.data ?? []) as ITdTask[];
      // ensure both arrays are tracked
      const sourceId = Number(String(event.previousContainer.id).replace('list-','')) || 0;
      this.tasksByListId[sourceId] = sourceArray;
      this.tasksByListId[targetId] = targetArray;

      transferArrayItem(sourceArray, targetArray, event.previousIndex, event.currentIndex);
      const movedTask = targetArray[event.currentIndex];
      // persist list change
      if (movedTask) {
        const previousListId = movedTask.tdListId as any;
        movedTask.tdListId = targetId as any;
        this.taskService.update(movedTask).subscribe({
          next: updated => {
            // keep arrays in sync
            const tgt = this.tasksByListId[targetId] || [];
            const idx = tgt.findIndex(t => t.id === updated.id);
            if (idx >= 0) tgt[idx] = updated;
            this.tasksByListId[targetId] = [...tgt];
          },
          error: _ => {
            // revert on error
            const tgt = this.tasksByListId[targetId] || [];
            const src = this.tasksByListId[sourceId] || [];
            const revertIndex = tgt.findIndex(t => t === movedTask);
            if (revertIndex >= 0) {
              transferArrayItem(tgt, src, revertIndex, sourceArray.length);
              this.tasksByListId[targetId] = [...tgt];
              this.tasksByListId[sourceId] = [...src];
            }
            movedTask.tdListId = previousListId;
          }
        });
      }
    }
  }

  public toggleTasks(list: ITdList) {
    const id = list.id as number;
    this.expanded[id] = !this.expanded[id];
    if (this.expanded[id]) {
      // ensure array exists for DnD target
      this.tasksByListId[id] = this.tasksByListId[id] || [];
    }
    if (this.expanded[id] && this.tasksByListId[id].length === 0 && !this.loadingTasks[id]) {
      this.loadingTasks[id] = true;
      // Load all tasks and filter client-side to avoid backend predicate quirks
      this.taskService.getAll()
        .subscribe(items => {
          this.tasksByListId[id] = items.filter(t => (t.tdListId as any) === id);
          this.loadingTasks[id] = false;
        });
    }
  }

  public beginAddTask(list: ITdList) {
    const id = list.id as number;
    this.newTaskByListId[id] = {
      id: 0 as any,
      title: '',
      description: '',
      dueDate: null,
      completedOn: null,
      isCompleted: false,
      priority: 2,
      tdListId: id,
      tdList: null
    } as ITdTask;
  }

  public async saveNewTask(list: ITdList) {
    const id = list.id as number;
    const newTask = this.newTaskByListId[id];
    if (!newTask) return;
    this.savingByListId[id] = true;
    this.taskService.create(newTask)
      .subscribe(created => {
        this.tasksByListId[id] = [...(this.tasksByListId[id] || []), created];
        this.newTaskByListId[id] = undefined;
        this.savingByListId[id] = false;
      });
  }

  public cancelNewTask(list: ITdList) {
    const id = list.id as number;
    this.newTaskByListId[id] = undefined;
  }

  public beginEditTask(task: ITdTask) {
    this.editingTaskCopyById[task.id as number] = { ...task } as ITdTask;
  }

  public saveEditTask(list: ITdList, task: ITdTask) {
    const id = list.id as number;
    const copy = this.editingTaskCopyById[task.id as number];
    if (!copy) return;
    this.savingByListId[id] = true;
    this.taskService.update(copy)
      .subscribe(updated => {
        const arr = this.tasksByListId[id] || [];
        const idx = arr.findIndex(t => t.id === updated.id);
        if (idx >= 0) arr[idx] = updated;
        this.tasksByListId[id] = [...arr];
        this.editingTaskCopyById[task.id as number] = undefined;
        this.savingByListId[id] = false;
      });
  }

  public cancelEditTask(task: ITdTask) {
    this.editingTaskCopyById[task.id as number] = undefined;
  }

  public deleteTask(list: ITdList, task: ITdTask) {
    const id = list.id as number;
    this.savingByListId[id] = true;
    this.taskService.deleteById(task.id as number)
      .subscribe(() => {
        const arr = (this.tasksByListId[id] || []).filter(t => t.id !== task.id);
        this.tasksByListId[id] = arr;
        this.savingByListId[id] = false;
      });
  }

  public getTaskCount(list: ITdList): number | undefined {
    const id = list.id as number;
    if (this.tasksByListId[id]) return this.tasksByListId[id].length;
    return undefined;
  }
//@CustomCodeEnd
}
