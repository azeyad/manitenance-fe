import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { WorkOrderModel } from '../models/work-order-model';
import { filter, merge, Observable, ReplaySubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WorkOrderPagingSortingModel } from '../models/work-order-paging-sorting-model';
import { WorkOrdersSearchResponseModel } from '../models/work-orders-search-response-model';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FilesUploadComponent } from '../files-upload/files-upload.component';

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
  workOrdersTotalCount = 0;
  pageSize = 10;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() pagingSortingChanged: EventEmitter<WorkOrderPagingSortingModel> = new EventEmitter();
  @Output() removeOrderRequest: EventEmitter<String> = new EventEmitter();

  constructor(private router: Router, private dialog: MatDialog) { }

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
