//@CustomCode
import { IdType, IdDefault } from '@app/models/i-key-model';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ITdTask } from '@app-models/entities/data/i-td-task';
import { TdTaskBaseListComponent } from '@app/components/entities/data/td-task-base-list.component';
import { TdTaskEditComponent } from '@app/components/entities/data/td-task-edit.component';
import { TdTaskService } from '@app-services/http/entities/data/td-task-service';

@Component({
  selector: 'app-td-task-cards',
  standalone: true,
  imports: [ CommonModule, FormsModule, TranslateModule, RouterModule ],
  templateUrl: './td-task-cards.component.html',
  styleUrl: './td-task-cards.component.css'
})
export class TdTaskCardsComponent extends TdTaskBaseListComponent {

  constructor(protected override dataAccessService: TdTaskService) {
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
    return 'TdTasksCards';
  }

  override getEditComponent() {
    return TdTaskEditComponent;
  }
}
