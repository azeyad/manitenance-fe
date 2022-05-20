export interface WorkOrdersSearchParameters {
    from?: Date;
    to?: Date;
    lineUuid?: String;
    departmentUuid?: String
    areaUuid?: String;
    machineUuid?: String;
    description?: String;
    orderSequence?: String;
    status?: String;
    personnelUuid?: String;
}