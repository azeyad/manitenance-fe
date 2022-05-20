export interface WorkOrderModel {
    uuid: String;
    description: String;
    code: String;
    creationDate: Date;
    machine: String;
    department: String;
    area: String;
    status: String;
    assignee: String;
}