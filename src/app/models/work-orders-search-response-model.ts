import { WorkOrderModel } from "./work-order-model";

export interface WorkOrdersSearchResponseModel {
    workOrders: WorkOrderModel[];
    totalOrdersCount: number;
}