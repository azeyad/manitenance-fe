import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkOrderModel } from '../models/work-order-model';
import { WorkOrdersSearchParameters } from '../models/work-orders-search-parameters';

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersDataService {

  constructor(private httpClient: HttpClient) { }

  public searchWorkOrders(searchParameters: WorkOrdersSearchParameters): Observable<WorkOrderModel[]> {
    return this.httpClient.post<WorkOrderModel[]>('/api/v1/user/workorder/search', searchParameters);
  }
}
