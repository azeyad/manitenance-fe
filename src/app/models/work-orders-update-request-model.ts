import { WorkOrdersCreateRequestModel } from "./work-orders-create-request-model";

export interface WorkOrdersUpdateRequestModel extends WorkOrdersCreateRequestModel {
    workOrderUuid: String;    
}