import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, merge, tap } from 'rxjs';
import { OrderDataLookup } from '../models/order-data-lookup.model';
import { WorkOrderModel } from '../models/work-order-model';
import { OrderLookupDataService } from '../services/order-lookup-data.service';
import { WorkOrdersDataService } from '../services/work-orders-data.service';

@Component({
  selector: 'app-release-order',
  templateUrl: './release-order.component.html',
  styleUrls: ['./release-order.component.scss']
})
export class ReleaseOrderComponent implements OnInit {

  @Input() workOrder: WorkOrderModel;
  @Input() currentAssignee: String;
  @Input() currentStatus: String;

  users: OrderDataLookup[] = [];
  statuses: OrderDataLookup[] = [];
  isLoading = true;

  constructor(private lookupsService: OrderLookupDataService, private orderDataService: WorkOrdersDataService,
    @Inject(MAT_DIALOG_DATA) data: any, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<any>) {
    this.workOrder = data.workOrder;
  }

  ngOnInit(): void {
    this.statuses = [];
    this.currentStatus = this.workOrder.status;
    this.users = [];
    this.currentAssignee = this.workOrder.assigneeUuid;
    merge(this.lookupsService.loadOrderStatuses().pipe(tap(statusesData => this.populateStatusList(statusesData))),
      this.lookupsService.loadUsers().pipe(tap(usersData => this.users = usersData))).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe();
  }

  private populateStatusList(statusesData: OrderDataLookup[]): void {
    this.statuses = statusesData.filter((status: OrderDataLookup) => this.workOrder.status !== status.key && status.key !== "FYI")
  }

  releaseOrder() {
    this.orderDataService.releaseWorkOrder(this.workOrder.uuid, this.currentStatus, this.currentAssignee)
      .subscribe({
        next: () => {
          this.snackBar.open(`Order #${this.workOrder.code} released successfully.`, "Success!");
          this.dialogRef.close();
        },
        error: () => {
          this.snackBar.open(`Failed to release order #${this.workOrder.code}.`, "Failed");
        }
      });
  }
}
