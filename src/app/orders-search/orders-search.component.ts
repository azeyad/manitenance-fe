import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { WorkOrderPagingSortingModel } from '../models/work-order-paging-sorting-model';
import { WorkOrdersSearchResponseModel } from '../models/work-orders-searc-response-model';
import { WorkOrdersSearchParameters } from '../models/work-orders-search-parameters';
import { OrderFiltersComponent } from '../order-filters/order-filters.component';
import { OrdersListComponent } from '../orders-list/orders-list.component';
import { WorkOrdersDataService } from '../services/work-orders-data.service';

@Component({
  selector: 'app-orders-search',
  templateUrl: './orders-search.component.html',
  styleUrls: ['./orders-search.component.css']
})
export class OrdersSearchComponent implements OnInit {

  @ViewChild(OrdersListComponent) ordersListComponenet: OrdersListComponent;
  @ViewChild(OrderFiltersComponent) orderFiltersComponent: OrderFiltersComponent;

  public isLoading = false;

  constructor(private ordersDataService: WorkOrdersDataService) { }

  ngOnInit(): void {
  }

  public onFiltersChanged(searchFilters: WorkOrdersSearchParameters): void {
    this.isLoading = true;
    this.ordersListComponenet.reset();
    const pagingSortingParams: WorkOrderPagingSortingModel = this.ordersListComponenet.getCurrentPagingSorting();
    this.searchWorkOrders(searchFilters, pagingSortingParams);
  }

  private searchWorkOrders(searchFilters: WorkOrdersSearchParameters, pagingSortingParams: WorkOrderPagingSortingModel) {
    this.ordersDataService.searchWorkOrders(searchFilters, pagingSortingParams).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (orders: WorkOrdersSearchResponseModel) => this.ordersListComponenet.setWOrkOrders(orders),
      error: error => {
        alert(JSON.stringify(error));
      }
    });
  }

  public onPagingSortingChanged(pagingSortingParams: WorkOrderPagingSortingModel) {
    const searchFilters: WorkOrdersSearchParameters = this.orderFiltersComponent.getCurrentFilters();
    this.searchWorkOrders(searchFilters, pagingSortingParams);
  }
}
