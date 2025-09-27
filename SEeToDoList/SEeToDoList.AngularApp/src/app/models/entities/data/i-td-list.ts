//@GeneratedCode
import { IKeyModel } from '@app-models/i-key-model';
import { ITdTask } from '@app-models/entities/data/i-td-task';
//@CustomImportBegin
//@CustomImportEnd
export interface ITdList extends IKeyModel {
  name: string | null;
  description: string | null;
  createdOn: Date;
  completedOn: Date | null;
  tasks: ITdTask[];
//@CustomCodeBegin
//@CustomCodeEnd
}
