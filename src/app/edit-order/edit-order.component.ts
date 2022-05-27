import { Component, OnInit, ViewChild } from '@angular/core';
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

  private orderUuid: String | null;
  constructor(private router: Router, private route: ActivatedRoute, private workOrderDataService: WorkOrdersDataService) { }


  ngOnInit(): void {
    this.orderUuid = this.route.snapshot.paramMap.get('orderUuid');
  }

  cancel(): void {
    this.router.navigateByUrl('/search');
  }

  canSubmit(): boolean {
    return this.orderUuid != null && this.orderUuid.length > 0 && this.orderPropertiesComponent && this.orderPropertiesComponent.isValid();
  }

  submit(): void {
    const orderModel: WorkOrdersUpdateRequestModel = { ...this.orderPropertiesComponent.getOrderCreateRequestModel(), uuid: this.orderUuid ? this.orderUuid : '' };
    this.workOrderDataService.editWorkOrder(orderModel)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/search');
        },
        error: (error) => {
          alert(JSON.stringify(error));
        }
      })
  }

  releaseOrder(): void {

  }

}
