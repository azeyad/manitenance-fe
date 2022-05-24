import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkOrderModel } from '../models/work-order-model';
import { OrderPropertiesComponent } from '../order-properties/order-properties.component';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

  @ViewChild(OrderPropertiesComponent) orderPropertiesComponent: OrderPropertiesComponent;
  constructor() { }

  ngOnInit(): void {
  }


  cancel(): void {

  }

  addNotes(): void {

  }

  addFiles(): void {

  }

  save(): void {
    const orderModel: WorkOrderModel = this.orderPropertiesComponent.getOrderModel();
    alert(orderModel.area + "," + orderModel.department + "," + orderModel.description + "," + orderModel.code);
  }

}
