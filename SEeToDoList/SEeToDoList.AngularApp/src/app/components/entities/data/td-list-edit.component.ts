//@CustomCode
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TdListBaseEditComponent }from '@app/components/entities/data/td-list-base-edit.component';
//@CustomImportBegin
//@CustomImportEnd
@Component({
  selector:'app-td-list-edit',
  standalone: true,
  imports: [ CommonModule, FormsModule, TranslateModule],
  templateUrl: './td-list-edit.component.html',
  styleUrl: './td-list-edit.component.css'
})
export class TdListEditComponent extends TdListBaseEditComponent {
//@CustomCodeBegin
//@CustomCodeEnd
}
