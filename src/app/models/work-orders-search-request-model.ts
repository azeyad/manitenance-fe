export interface WorkOrdersSearchRequestModel {
    from?: String;
    to?: String;
    lineUuid?: String;
    departmentUuid?: String
    areaUuid?: String;
    machineUuid?: String;
    description?: String;
    orderCode?: String;
    status?: String;
    personnelUuid?: String;    
}