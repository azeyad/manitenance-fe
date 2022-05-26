export interface WorkOrderModel {
    uuid?: String;
    line: String;
    description: String;
    code: String;
    creationDate: String;
    machine: String;
    department: String;
    area: String;
    status: String;
    assignee: String;
}