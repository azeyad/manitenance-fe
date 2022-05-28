import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WorkOrderPagingSortingModel } from '../models/work-order-paging-sorting-model';
import { WorkOrdersSearchResponseModel } from '../models/work-orders-search-response-model';
import { WorkOrdersSearchRequestModel } from '../models/work-orders-search-request-model';
import { WorkOrdersCreateRequestModel } from '../models/work-orders-create-request-model';
import { WorkOrdersUpdateRequestModel } from '../models/work-orders-update-request-model';
import { WorkOrderModel } from '../models/work-order-model';

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersDataService {

  constructor(private httpClient: HttpClient) { }

  getWorkOrderByUuid(uuid: String): Observable<WorkOrderModel> {
    return this.httpClient.get<WorkOrderModel>(`/api/v1/user/workorder/getOrder?uuid=${uuid}`);
  }

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

  saveWorkOrder(workorderModel: WorkOrdersCreateRequestModel) {
    return this.httpClient.post('/api/v1/user/workorder/create', workorderModel);
  }

  editWorkOrder(workorderModel: WorkOrdersUpdateRequestModel) {
    return this.httpClient.post('/api/v1/user/workorder/create', workorderModel);
  }
}
