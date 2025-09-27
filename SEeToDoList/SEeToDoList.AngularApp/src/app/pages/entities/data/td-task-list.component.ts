//@CustomCode
import { IdType, IdDefault } from '@app/models/i-key-model';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ITdTask } from '@app-models/entities/data/i-td-task';
import { TdTaskBaseListComponent }from '@app/components/entities/data/td-task-base-list.component';
import { TdTaskEditComponent }from '@app/components/entities/data/td-task-edit.component';
import { TdTaskService } from '@app-services/http/entities/data/td-task-service';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  selector:'app-td-task-list',
  imports: [ CommonModule, FormsModule, TranslateModule ],
  templateUrl: './td-task-list.component.html',
  styleUrl: './td-task-list.component.css'
})
export class TdTaskListComponent extends TdTaskBaseListComponent {
  constructor(protected override dataAccessService: TdTaskService)
  {
    super(dataAccessService);
  }
  override ngOnInit(): void {
    this._queryParams.filter = 'title.ToLower().Contains(@0) OR description.ToLower().Contains(@0)';
    this.reloadData();
  }
  protected override getItemKey(item: ITdTask): IdType {
    return item?.id || IdDefault;
  }
  override get pageTitle(): string {
    return 'TdTasks';
  }
  override getEditComponent() {
    return TdTaskEditComponent;
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
