//@GeneratedCode
import { Directive, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IdType, IdDefault, IKeyModel } from '@app/models/i-key-model';
import { GenericEditComponent } from '@app/components/base/generic-edit.component';
import { ITdList } from '@app-models/entities/data/i-td-list';
//@CustomImportBegin
//@CustomImportEnd
@Directive()
export abstract class TdListBaseEditComponent extends GenericEditComponent<ITdList> implements OnInit {
  constructor(public override activeModal: NgbActiveModal)
  {
    super(activeModal);
  }
  ngOnInit(): void {
  }

  public override getItemKey(item: ITdList): IdType {
    return item?.id || IdDefault;
  }

  public override get title(): string {
    return 'TdList' + super.title;
  }
//@CustomCodeBegin
//@CustomCodeEnd
}
