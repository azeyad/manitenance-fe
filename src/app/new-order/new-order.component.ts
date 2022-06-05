import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { WorkOrderModel } from '../models/work-order-model';
import { WorkOrdersCreateRequestModel } from '../models/work-orders-create-request-model';
import { OrderPropertiesComponent } from '../order-properties/order-properties.component';
import { WorkOrdersDataService } from '../services/work-orders-data.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit {

  @ViewChild(OrderPropertiesComponent) orderPropertiesComponent: OrderPropertiesComponent;

  constructor(private router: Router, private workOrderDataService: WorkOrdersDataService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }


  cancel(): void {
    this.router.navigateByUrl('/search');
  }

  addNotes(): void {

  }

  addFiles(): void {

  }

  canSubmit(): boolean {
    return this.orderPropertiesComponent && this.orderPropertiesComponent.isValid();
  }

  submit(): void {
    const orderModel: WorkOrdersCreateRequestModel = this.orderPropertiesComponent.getOrderCreateRequestModel();
    this.workOrderDataService.saveWorkOrder(orderModel)
      .subscribe({
        next: () => {
          this.snackBar.open("Work order created successfully", "Success!", {
            duration: 2000
          });
          this.router.navigateByUrl('/search');
        },
        error: () => {
          this.snackBar.open("Failed to create work order", "Error!", {
            duration: 2000
          });
        }
      })
  }

}
