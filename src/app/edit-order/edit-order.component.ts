import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, finalize, tap } from 'rxjs';
import { FilesUploadComponent } from '../files-upload/files-upload.component';
import { WorkOrderModel } from '../models/work-order-model';
import { WorkOrdersUpdateRequestModel } from '../models/work-orders-update-request-model';
import { OrderPropertiesComponent } from '../order-properties/order-properties.component';
import { ReleaseOrderComponent } from '../release-order/release-order.component';
import { WorkOrdersDataService } from '../services/work-orders-data.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent implements OnInit, AfterViewInit {

  @ViewChild(OrderPropertiesComponent) orderPropertiesComponent: OrderPropertiesComponent;
  @ViewChild('propertiesContainerElementRef') propertiesContainerElementRef: ElementRef;

  orderUuid: String;
  currentLine: String;
  currentArea: String;
  currentMachine: String;
  currentDept: String;
  currentAssignee: String;
  currentStatus: String;
  description: String;
  orderNumber: String;
  orderDate: Date;
  propertiesCardHeight = 0;
  isSaving = false;
  workOrderModel: WorkOrderModel;

  constructor(private router: Router, private route: ActivatedRoute,
    private workOrderDataService: WorkOrdersDataService, private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    const orderUuidRouteParam = this.route.snapshot.paramMap.get('orderUuid');
    if (orderUuidRouteParam) {
      this.orderUuid = orderUuidRouteParam;
      this.workOrderDataService.getWorkOrderByUuid(this.orderUuid)
        .subscribe({
          next: workOrder => {
            this.workOrderModel = workOrder;
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

  ngAfterViewInit(): void {
    this.propertiesCardHeight = this.propertiesContainerElementRef.nativeElement.clientHeight;
  }

  cancel(): void {
    this.router.navigateByUrl('/search');
  }

  canSubmit(): boolean {
    return this.orderUuid && this.orderPropertiesComponent && this.orderPropertiesComponent.isValid() && this.orderPropertiesComponent.isChanged() && !this.isSaving;
  }

  submit(): void {
    this.isSaving = true;
    const orderModel: WorkOrdersUpdateRequestModel = { ...this.orderPropertiesComponent.getOrderCreateRequestModel(), workOrderUuid: this.orderUuid ? this.orderUuid : '' };
    this.workOrderDataService.editWorkOrder(orderModel).pipe(finalize(() => this.isSaving = false))
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

  uploadFiles(): void {
    this.dialog.open(FilesUploadComponent, {
      data: {
        orderUuid: this.orderUuid
      }
    });
  }

  releaseOrder(): void {
    const dialogRef = this.dialog.open(ReleaseOrderComponent, {
      data: {
        workOrder: this.workOrderModel
      }
    });
    dialogRef.afterClosed().pipe(tap(res => console.log(JSON.stringify(res))), filter(result => result))
      .subscribe(() => {
        this.router.navigateByUrl('/search');
      });
  }

}
