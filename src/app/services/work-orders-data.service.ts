import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WorkOrderPagingSortingModel } from '../models/work-order-paging-sorting-model';
import { WorkOrdersSearchResponseModel } from '../models/work-orders-searc-response-model';
import { WorkOrdersSearchParameters } from '../models/work-orders-search-parameters';

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersDataService {

  constructor(private httpClient: HttpClient) { }

  public searchWorkOrders(searchParameters: WorkOrdersSearchParameters, pagingSortingParams: WorkOrderPagingSortingModel): Observable<WorkOrdersSearchResponseModel> {
    const sortQueryStr = `${pagingSortingParams.sort},${pagingSortingParams.direction}`;
    const queryStr = `page=${pagingSortingParams.page}&size=${pagingSortingParams.size}&sort=${sortQueryStr}`;
    return this.httpClient.post(`/api/v1/user/workorder/search?${queryStr}`, searchParameters).pipe(
      map((workOrderPage: any) => {
        const responseModel: WorkOrdersSearchResponseModel = {
          workOrders: workOrderPage.content,
          totalOrdersCount: workOrderPage.totalElements
        }
        return responseModel;
      })
    );
  }
}
