//@GeneratedCode
import { IdType, IdDefault } from '@app-models/i-key-model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiEntityBaseService } from '@app-services/api-entity-base.service';
import { environment } from '@environment/environment';
import { ITdList } from '@app-models/entities/data/i-td-list';
//@CustomImportBegin
//@CustomImportEnd
@Injectable({
  providedIn: 'root',
})
export class TdListService extends ApiEntityBaseService<ITdList> {
  constructor(public override http: HttpClient) {
    super(http, environment.API_BASE_URL + '/tdlists');
  }

  public override getItemKey(item: ITdList): IdType {
    return item?.id || IdDefault;
  }

//@CustomCodeBegin
//@CustomCodeEnd
}
