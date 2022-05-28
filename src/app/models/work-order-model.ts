export interface WorkOrderModel {
    uuid: String;
    line: String;
    lineUuid: String;
    description: String;
    code: String;
    creationDate: Date;
    machine: String;
    machineUuid: String;
    department: String;
    departmentUuid: String;
    area: String;
    areaUuid: String;
    status: String;
    assignee: String;
    assigneeUuid: String;
}