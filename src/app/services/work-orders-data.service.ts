import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { WorkOrderPagingSortingModel } from '../models/work-order-paging-sorting-model';
import { WorkOrdersSearchResponseModel } from '../models/work-orders-search-response-model';
import { WorkOrdersSearchRequestModel } from '../models/work-orders-search-request-model';
import { WorkOrdersCreateRequestModel } from '../models/work-orders-create-request-model';
import { WorkOrdersUpdateRequestModel } from '../models/work-orders-update-request-model';
import { WorkOrderModel } from '../models/work-order-model';
import { WorkOrderFileDataModel } from '../models/work-order-file-data-model';

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersDataService {

  public filesUploadedSubject: Subject<String> = new Subject();

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

  saveWorkOrder(workorderModel: WorkOrdersCreateRequestModel): Observable<WorkOrderModel> {
    return this.httpClient.post<WorkOrderModel>('/api/v1/user/workorder/create', workorderModel);
  }

  editWorkOrder(workorderModel: WorkOrdersUpdateRequestModel): Observable<WorkOrderModel> {
    return this.httpClient.post<WorkOrderModel>('/api/v1/user/workorder/update', workorderModel);
  }

  removeWorkOrder(orderUuid: String) {
    return this.httpClient.delete(`/api/v1/user/workorder/delete?orderUuid=${orderUuid}`);
  }

  uploadFiles(orderUuid: String, files: FormData) {
    return this.httpClient.post(`/api/v1/user/workorder/attach?orderUuid=${orderUuid}`, files).pipe(
      tap(() => this.filesUploadedSubject.next(orderUuid))
    );
  }

  getWorkOrderImagesMetadata(orderUuid: String): Observable<WorkOrderFileDataModel[]> {
    return this.httpClient.get<WorkOrderFileDataModel[]>(`/api/v1/user/workorder/images?orderUuid=${orderUuid}`);
  }

  getWorkOrderImageBytes(orderUuid: String, imageUuid: String) {
    return this.httpClient.get(`/api/v1/user/workorder/image?orderUuid=${orderUuid}&imageUuid=${imageUuid}`, { responseType: 'arraybuffer' });
  }

  deleteFile(orderUuid: String, fileUuid: String) {
    return this.httpClient.delete(`/api/v1/user/workorder/${orderUuid}/image/${fileUuid}`);
  }

  releaseWorkOrder(orderUuid: String, statusUuid: String, assigneeUuid: String) {
    return this.httpClient.post(`/api/v1/user/workorder/${orderUuid}/release`, { statusUuid: statusUuid, assigneeUuid: assigneeUuid });
  }
}
