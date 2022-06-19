import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { WorkOrderModel } from '../models/work-order-model';
import { filter, merge, Observable, ReplaySubject, switchMap, tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WorkOrderPagingSortingModel } from '../models/work-order-paging-sorting-model';
import { WorkOrdersSearchResponseModel } from '../models/work-orders-search-response-model';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FilesUploadComponent } from '../files-upload/files-upload.component';
import { ReleaseOrderComponent } from '../release-order/release-order.component';
import { WorkOrdersDataService } from '../services/work-orders-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit, AfterViewInit {
  dataSource: WorkOrdersDataSource = new WorkOrdersDataSource([]);
  displayedColumns: string[] = ['actions', 'code', 'description', 'creationDate', 'machine', 'department', 'area', 'status', 'assignee'];

  _workOrdersData: WorkOrderModel[] = [];
  @Input()
  set workOrdersData(value: WorkOrderModel[]) {
    this._workOrdersData = value;
    this.dataSource.setData(value);
  }
  @Input() isLoading = false;

  selectedOrder: WorkOrderModel;
  workOrdersTotalCount = 0;
  pageSize = 10;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() pagingSortingChanged: EventEmitter<WorkOrderPagingSortingModel> = new EventEmitter();
  @Output() removeOrderRequest: EventEmitter<String> = new EventEmitter();
  @Output() selectedOrderChanged: EventEmitter<String> = new EventEmitter();
  @Output() orderReleased: EventEmitter<void> = new EventEmitter();

  constructor(private router: Router, private dialog: MatDialog, private orderDataService: WorkOrdersDataService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .subscribe(() => {
        this.pagingSortingChanged.emit(this.getCurrentPagingSorting());
      });
  }

  getCurrentPagingSorting(): WorkOrderPagingSortingModel {
    return {
      sort: this.sort.active,
      direction: this.sort.direction,
      page: this.paginator.pageIndex,
      size: this.pageSize
    };
  }

  setWOrkOrders(workOrdersResponseModel: WorkOrdersSearchResponseModel) {
    this.dataSource.setData(workOrdersResponseModel.workOrders);
    this.workOrdersTotalCount = workOrdersResponseModel.totalOrdersCount;
    if (workOrdersResponseModel.workOrders && workOrdersResponseModel.workOrders.length > 0) {
      const selectedOrderIndex = this.getSelectedOrderIndex(workOrdersResponseModel);
      this.selectOrder(workOrdersResponseModel.workOrders[selectedOrderIndex]);
    }
  }

  private getSelectedOrderIndex(workOrdersResponseModel: WorkOrdersSearchResponseModel): number {
    if (this.selectedOrder && workOrdersResponseModel.workOrders && workOrdersResponseModel.workOrders.length > 0) {
      const prevSelectedOrderIndex = workOrdersResponseModel.workOrders.findIndex(p => p.uuid === this.selectedOrder.uuid);
      if (prevSelectedOrderIndex !== -1) return prevSelectedOrderIndex;
    }
    return 0;
  }

  reset() {
    this.dataSource.setData([])
    this.resetPagingAndSorting();
  }

  private resetPagingAndSorting(): void {
    this.paginator.pageIndex = 0;
    this.sort.active = "creationDate";
    this.sort.direction = "desc";
  }

  editOrder(orderUuid: String): void {
    this.router.navigateByUrl(`/edit/${orderUuid}`);
  }

  removeOrder(order: WorkOrderModel): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Are you sure you want to delete work order: ${order.code}?`
      }
    });

    dialogRef.afterClosed().pipe(filter(result => result))
      .subscribe(() => {
        this.removeOrderRequest.emit(order.uuid);
      });
  }

  attachFiles(orderUuid: String): void {
    this.dialog.open(FilesUploadComponent, {
      data: {
        orderUuid: orderUuid
      }
    });
  }

  selectOrder(order: WorkOrderModel) {
    this.selectedOrder = order;
    this.selectedOrderChanged.emit(order.uuid);
  }

  releaseWOrkOrder(order: WorkOrderModel) {
    const dialogRef = this.dialog.open(ReleaseOrderComponent, {
      data: {
        workOrder: order
      }
    });
    dialogRef.afterClosed().pipe(tap(res => console.log(JSON.stringify(res))), filter(result => result))
      .subscribe(() => {
        this.orderReleased.emit();
      });
  }

  copyOrderPath(orderUuid: String) {
    this.orderDataService.getOrderPath(orderUuid).pipe(
      switchMap(path => navigator.clipboard.writeText(path))
    ).subscribe({
      next: () => this.snackBar.open("Work order path copied to clipboard", "Success"),
      error: error => {
        this.snackBar.open("Failed to get order path", "Error");
      }
    })
  }

  openAuditTrails(order: WorkOrderModel) {
    this.router.navigateByUrl(`/history/${order.uuid}`);
  }

  formatOrderDate(order: WorkOrderModel) {
    const date = new Date(order.creationDate).toLocaleDateString(navigator.language);
    const time = new Date(order.creationDate).toLocaleTimeString(navigator.language);
    return `${date}, ${time}`;
  }
}

class WorkOrdersDataSource extends DataSource<WorkOrderModel> {
  private _dataStream = new ReplaySubject<WorkOrderModel[]>();

  constructor(initialData: WorkOrderModel[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<WorkOrderModel[]> {
    return this._dataStream;
  }

  disconnect() { }

  setData(data: WorkOrderModel[]) {
    this._dataStream.next(data);
  }
}
