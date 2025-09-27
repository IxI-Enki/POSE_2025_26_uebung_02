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
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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
  public dropList(event: CdkDragDrop<ITdList[]>) {
    moveItemInArray(this.dataItems, event.previousIndex, event.currentIndex);
  }
  public dropTask(list: ITdList, event: CdkDragDrop<ITdTask[]>) {
    const id = list.id as number;
    const arr = this.tasksByListId[id] || [];
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    this.tasksByListId[id] = [...arr];
  }

  public toggleTasks(list: ITdList) {
    const id = list.id as number;
    this.expanded[id] = !this.expanded[id];
    if (this.expanded[id] && !this.tasksByListId[id] && !this.loadingTasks[id]) {
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
