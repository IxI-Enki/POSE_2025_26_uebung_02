//@CustomCode
import { IdType, IdDefault } from '@app/models/i-key-model';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ITdList } from '@app-models/entities/data/i-td-list';
import { TdListBaseListComponent }from '@app/components/entities/data/td-list-base-list.component';
import { TdListEditComponent }from '@app/components/entities/data/td-list-edit.component';
import { TdListService } from '@app-services/http/entities/data/td-list-service';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  selector:'app-td-list-list',
  standalone: true,
  imports: [ CommonModule, FormsModule, TranslateModule ],
  templateUrl: './td-list-list.component.html',
  styleUrl: './td-list-list.component.css'
})
export class TdListListComponent extends TdListBaseListComponent {
  constructor(protected override dataAccessService: TdListService)
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
//@CustomCodeBegin
//@CustomCodeEnd
}
