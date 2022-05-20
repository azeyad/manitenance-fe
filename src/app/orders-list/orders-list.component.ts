import { Component, Input, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { WorkOrderModel } from '../models/work-order-model';
import { Observable, ReplaySubject } from 'rxjs';
import { WorkOrdersDataService } from '../services/work-orders-data.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
  dataSource: WorkOrdersDataSource = new WorkOrdersDataSource([]);
  displayedColumns: string[] = ['code', 'creationDate', 'machine', 'department', 'area', 'status', 'assignee'];

  _workOrdersData: WorkOrderModel[] = [];
  @Input()
  set workOrdersData(value: WorkOrderModel[]) {
    this._workOrdersData = value;
    this.dataSource.setData(value);
  }

  constructor(private ordersDataService: WorkOrdersDataService) { }

  ngOnInit(): void {
    this.ordersDataService.searchWorkOrders({ status: 'FYI' })
      .subscribe({
        next: (orders: WorkOrderModel[]) => this.dataSource.setData(orders),
        error: error => {
          alert(JSON.stringify(error));
        }
      }
      )
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
