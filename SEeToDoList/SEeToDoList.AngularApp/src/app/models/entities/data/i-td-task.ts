//@GeneratedCode
import { IKeyModel } from '@app-models/i-key-model';
import { ITdList } from '@app-models/entities/data/i-td-list';
//@CustomImportBegin
//@CustomImportEnd
export interface ITdTask extends IKeyModel {
  title: string | null;
  description: string | null;
  dueDate: Date | null;
  completedOn: Date | null;
  isCompleted: boolean;
  priority: number;
  tdListId: number;
  tdList: ITdList | null;
//@CustomCodeBegin
//@CustomCodeEnd
}
