import * as moment from "moment";

export interface WorkOrdersSearchRequestModel {
    from?: String | null;
    to?: String | null;
    lineUuid?: String;
    departmentUuid?: String
    areaUuid?: String;
    machineUuid?: String;
    description?: String;
    orderCode?: String;
    status?: String;
    personnelUuid?: String;    
}