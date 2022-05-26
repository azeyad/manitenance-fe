import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WorkOrderModel } from '../models/work-order-model';
import { WorkOrdersCreateRequestModel } from '../models/work-orders-create-request-model';
import { OrderPropertiesComponent } from '../order-properties/order-properties.component';
import { WorkOrdersDataService } from '../services/work-orders-data.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

  @ViewChild(OrderPropertiesComponent) orderPropertiesComponent: OrderPropertiesComponent;

  constructor(private router: Router, private workOrderDataService: WorkOrdersDataService) { }

  ngOnInit(): void {
  }


  cancel(): void {

  }

  addNotes(): void {

  }

  addFiles(): void {

  }

  save(): void {
    const orderModel: WorkOrdersCreateRequestModel = this.orderPropertiesComponent.getOrderCreateRequestModel();
    this.workOrderDataService.saveWorkOrder(orderModel)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/search');
        },
        error: (error) => {
          alert(JSON.stringify(error));
        }
      })
  }

}
