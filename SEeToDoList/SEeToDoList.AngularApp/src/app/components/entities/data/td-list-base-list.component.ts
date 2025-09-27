//@GeneratedCode
import { Directive, OnInit } from '@angular/core';
import { GenericEntityListComponent } from '@app/components/base/generic-entity-list.component';
import { ITdList } from '@app-models/entities/data/i-td-list';
import { TdListService } from '@app-services/http/entities/data/td-list-service';
//@CustomImportBegin
//@CustomImportEnd
@Directive()
export abstract class TdListBaseListComponent extends GenericEntityListComponent<ITdList> implements OnInit {
  constructor(
              protected dataAccessService: TdListService
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
