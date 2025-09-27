//@GeneratedCode
import { Directive, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IdType, IdDefault, IKeyModel } from '@app/models/i-key-model';
import { GenericEditComponent } from '@app/components/base/generic-edit.component';
import { ITdTask } from '@app-models/entities/data/i-td-task';
//@CustomImportBegin
//@CustomImportEnd
@Directive()
export abstract class TdTaskBaseEditComponent extends GenericEditComponent<ITdTask> implements OnInit {
  constructor(public override activeModal: NgbActiveModal)
  {
    super(activeModal);
  }
  ngOnInit(): void {
  }

  public override getItemKey(item: ITdTask): IdType {
    return item?.id || IdDefault;
  }

  public override get title(): string {
    return 'TdTask' + super.title;
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
