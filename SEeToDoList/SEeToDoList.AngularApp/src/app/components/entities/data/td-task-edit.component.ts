//@CustomCode
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TdTaskBaseEditComponent }from '@app/components/entities/data/td-task-base-edit.component';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  selector:'app-td-task-edit',
  standalone: true,
  imports: [ CommonModule, FormsModule, TranslateModule],
  templateUrl: './td-task-edit.component.html',
  styleUrl: './td-task-edit.component.css'
})
export class TdTaskEditComponent extends TdTaskBaseEditComponent {
//@CustomCodeBegin
//@CustomCodeEnd
}
