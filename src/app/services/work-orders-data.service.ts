import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WorkOrderPagingSortingModel } from '../models/work-order-paging-sorting-model';
import { WorkOrdersSearchResponseModel } from '../models/work-orders-search-response-model';
import { WorkOrdersSearchRequestModel } from '../models/work-orders-search-request-model';

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersDataService {

  constructor(private httpClient: HttpClient) { }

  searchWorkOrders(searchParameters: WorkOrdersSearchRequestModel, pagingSortingParams: WorkOrderPagingSortingModel): Observable<WorkOrdersSearchResponseModel> {
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
