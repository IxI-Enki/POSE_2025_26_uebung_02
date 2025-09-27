//@GeneratedCode
import { IdType, IdDefault } from '@app-models/i-key-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEntityBaseService } from '@app-services/api-entity-base.service';
import { environment } from '@environment/environment';
import { ITdTask } from '@app-models/entities/data/i-td-task';
//@CustomImportBegin
//@CustomImportEnd
@Injectable({
  providedIn: 'root',
})
export class TdTaskService extends ApiEntityBaseService<ITdTask> {
  constructor(public override http: HttpClient) {
    super(http, environment.API_BASE_URL + '/tdtasks');
  }

  public override getItemKey(item: ITdTask): IdType {
    return item?.id || IdDefault;
  }

//@CustomCodeBegin
//@CustomCodeEnd
}
