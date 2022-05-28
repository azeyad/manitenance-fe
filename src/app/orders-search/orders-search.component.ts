import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { finalize } from 'rxjs';
import { WorkOrderPagingSortingModel } from '../models/work-order-paging-sorting-model';
import { WorkOrdersSearchResponseModel } from '../models/work-orders-search-response-model';
import { WorkOrdersSearchRequestModel } from '../models/work-orders-search-request-model';
import { OrderFiltersComponent } from '../order-filters/order-filters.component';
import { OrdersListComponent } from '../orders-list/orders-list.component';
import { WorkOrdersDataService } from '../services/work-orders-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders-search',
  templateUrl: './orders-search.component.html',
  styleUrls: ['./orders-search.component.css']
})
export class OrdersSearchComponent implements OnInit {

  @ViewChild(OrdersListComponent) ordersListComponenet: OrdersListComponent;
  @ViewChild(OrderFiltersComponent) orderFiltersComponent: OrderFiltersComponent;

  isLoading = false;

  constructor(private ordersDataService: WorkOrdersDataService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadTodayWorkOrders();
  }


  private loadTodayWorkOrders() {
    const searchFilters: WorkOrdersSearchRequestModel = {
      from: moment().format('YYYY-MM-DD'),
      to: moment().format('YYYY-MM-DD')
    };
    const pagingSortingParams: WorkOrderPagingSortingModel = {
      page: 0,
      sort: 'creationDate',
      direction: 'desc',
      size: 10
    }
    this.searchWorkOrders(searchFilters, pagingSortingParams);
  }

  onFiltersChanged(searchFilters: WorkOrdersSearchRequestModel): void {
    this.ordersListComponenet.reset();
    const pagingSortingParams: WorkOrderPagingSortingModel = this.ordersListComponenet.getCurrentPagingSorting();
    this.searchWorkOrders(searchFilters, pagingSortingParams);
  }

  private searchWorkOrders(searchFilters: WorkOrdersSearchRequestModel, pagingSortingParams: WorkOrderPagingSortingModel) {
    this.isLoading = true;
    this.ordersDataService.searchWorkOrders(searchFilters, pagingSortingParams).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (orders: WorkOrdersSearchResponseModel) => this.ordersListComponenet.setWOrkOrders(orders),
      error: () => {
        this.snackBar.open("Failed to search work order", "Error!", {
          duration: 2000
        });
      }
    });
  }

  reloadWorkOrders() {
    this.ordersListComponenet.reset();
    const pagingSortingParams: WorkOrderPagingSortingModel = this.ordersListComponenet.getCurrentPagingSorting();
    const searchFilters: WorkOrdersSearchRequestModel = this.orderFiltersComponent.getCurrentFilters();
    this.searchWorkOrders(searchFilters, pagingSortingParams);
  }

  onPagingSortingChanged(pagingSortingParams: WorkOrderPagingSortingModel) {
    const searchFilters: WorkOrdersSearchRequestModel = this.orderFiltersComponent.getCurrentFilters();
    this.searchWorkOrders(searchFilters, pagingSortingParams);
  }

  onRemoveWorkOrder(orderUuid: String) {
    this.ordersDataService.removeWorkOrder(orderUuid)
      .subscribe({
        next: () => {
          this.snackBar.open("Order removed successfuly", "Success!", {
            duration: 2000
          });
          this.reloadWorkOrders();
        },
        error: () => {
          this.snackBar.open("Failed to remove work order", "Failed!", {
            duration: 2000
          });
        }
      });
  }
}
