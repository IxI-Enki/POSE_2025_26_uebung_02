//@GeneratedCode
import { Directive, OnInit } from '@angular/core';
import { GenericEntityListComponent } from '@app/components/base/generic-entity-list.component';
import { ITdTask } from '@app-models/entities/data/i-td-task';
import { TdTaskService } from '@app-services/http/entities/data/td-task-service';
//@CustomImportBegin
//@CustomImportEnd
@Directive()
export abstract class TdTaskBaseListComponent extends GenericEntityListComponent<ITdTask> implements OnInit {
  constructor(
              protected dataAccessService: TdTaskService
            )
  {
    super(dataAccessService);
  }
  ngOnInit(): void {
    this.reloadData();
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
