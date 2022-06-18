export interface AuditTrailModel {
    orderUuid: String;
    user: String;    
    action: String;
    orderCode: String;
    dateTime: Date;
    details: AuditTrailDetailsModel[];
}

export interface AuditTrailDetailsModel {
    propertyName: String;
    previousValue: String;
    currentValue: String;
}