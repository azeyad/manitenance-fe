import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrdersUpdateRequestModel } from '../models/work-orders-update-request-model';
import { OrderPropertiesComponent } from '../order-properties/order-properties.component';
import { WorkOrdersDataService } from '../services/work-orders-data.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {

  @ViewChild(OrderPropertiesComponent) orderPropertiesComponent: OrderPropertiesComponent;

  private orderUuid: String;
  currentLine: String;
  currentArea: String;
  currentMachine: String;
  currentDept: String;
  currentAssignee: String;
  currentStatus: String;
  description: String;
  orderNumber: String;
  orderDate: Date;

  constructor(private router: Router, private route: ActivatedRoute, private workOrderDataService: WorkOrdersDataService, private snackBar: MatSnackBar) { }


  ngOnInit(): void {
    const orderUuidRouteParam = this.route.snapshot.paramMap.get('orderUuid');
    if (orderUuidRouteParam) {
      this.orderUuid = orderUuidRouteParam;
      this.workOrderDataService.getWorkOrderByUuid(this.orderUuid)
        .subscribe({
          next: workOrder => {
            this.currentArea = workOrder.areaUuid;
            this.currentLine = workOrder.lineUuid;
            this.currentDept = workOrder.departmentUuid;
            this.currentMachine = workOrder.machineUuid;
            this.currentAssignee = workOrder.assigneeUuid;
            this.currentStatus = workOrder.status;
            this.description = workOrder.description;
            this.orderNumber = workOrder.code;
            this.orderDate = workOrder.creationDate;
          },
          error: () => {
            this.snackBar.open("Failed to load work order", "Error!", {
              duration: 2000
            });
          }
        })
    } else {
      this.router.navigateByUrl('/search');
    }
  }

  cancel(): void {
    this.router.navigateByUrl('/search');
  }

  canSubmit(): boolean {
    return this.orderUuid && this.orderPropertiesComponent && this.orderPropertiesComponent.isValid() && this.orderPropertiesComponent.isChanged();
  }

  submit(): void {
    const orderModel: WorkOrdersUpdateRequestModel = { ...this.orderPropertiesComponent.getOrderCreateRequestModel(), uuid: this.orderUuid ? this.orderUuid : '' };
    this.workOrderDataService.editWorkOrder(orderModel)
      .subscribe({
        next: () => {
          this.snackBar.open("Work order updated successfully", "Success!", {
            duration: 2000
          });
          this.router.navigateByUrl('/search');
        },
        error: () => {
          this.snackBar.open("Failed to update work order", "Error!", {
            duration: 2000
          });
        }
      })
  }

  releaseOrder(): void {

  }

}
