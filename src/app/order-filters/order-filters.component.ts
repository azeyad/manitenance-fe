import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { OrderDataLookup, OrderStatusLookup } from '../models/order-data-lookup.model';
import { WorkOrdersSearchParameters } from '../models/work-orders-search-parameters';
import { OrderLookupDataService } from '../services/order-lookup-data.service';

@Component({
  selector: 'app-order-filters',
  templateUrl: './order-filters.component.html',
  styleUrls: ['./order-filters.component.css']
})
export class OrderFiltersComponent implements OnInit {

  private _currentLine: String = '';
  public get currentLine(): String {
    return this._currentLine;
  }
  public set currentLine(value: String) {
    this._currentLine = value;
    this.onLineChanged(value);
  }


  private _currentArea: String = '';
  public get currentArea(): String {
    return this._currentArea;
  }
  public set currentArea(value: String) {
    this._currentArea = value;
    this.onAreaChanged(value);
  }

  private _currentMachine: String = '';
  public get currentMachine(): String {
    return this._currentMachine;
  }
  public set currentMachine(value: String) {
    this._currentMachine = value;
  }

  private _currentDept: String = '';
  public get currentDept(): String {
    return this._currentDept;
  }
  public set currentDept(value: String) {
    this._currentDept = value;
    this.onDeptChanged(value);
  }

  private _currentAssignee: String = '';
  public get currentAssignee(): String {
    return this._currentAssignee;
  }
  public set currentAssignee(value: String) {
    this._currentAssignee = value;
  }

  private _currentStatus: String = '';
  public get currentStatus(): String {
    return this._currentStatus;
  }
  public set currentStatus(value: String) {
    this._currentStatus = value;
  }

  description: String = '';
  orderNumber: String = '';
  orderDateFrom: Date | null;
  orderDateTo: Date | null;

  lines: OrderDataLookup[] = [];
  areas: OrderDataLookup[] = [];
  depts: OrderDataLookup[] = [];
  machines: OrderDataLookup[] = [];
  users: OrderDataLookup[] = [];
  statuses: OrderStatusLookup[] = [];

  private isClearingFilters = false;

  @Output() filtersChanged: EventEmitter<WorkOrdersSearchParameters> = new EventEmitter();

  constructor(private lookupsService: OrderLookupDataService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadStatuses();
    this.loadLines();
  }

  private loadLines(): void {
    this.lookupsService.loadLines()
      .subscribe((linesData: OrderDataLookup[]) => {
        this.lines = linesData;
      });
  }

  public onLineChanged(lineUuid: String): void {
    if (this.isClearingFilters) return;
    this.areas = [];
    this.lookupsService.loadLineAreas(lineUuid)
      .subscribe((areasData: OrderDataLookup[]) => {
        this.areas = areasData;
      });
  }

  public onAreaChanged(areaUuid: String): void {
    if (this.isClearingFilters) return;
    this.depts = [];
    this.lookupsService.loadAreadepts(areaUuid)
      .subscribe((deptsData: OrderDataLookup[]) => {
        this.depts = deptsData;
      });
  }

  public onDeptChanged(deptUuid: String) {
    if (this.isClearingFilters) return;
    this.machines = [];
    this.lookupsService.loadDeptMachines(deptUuid)
      .subscribe((machinesData: OrderDataLookup[]) => {
        this.machines = machinesData;
      });
  }

  private loadStatuses(): void {
    this.statuses = [];
    this.lookupsService.loadOrderStatuses()
      .subscribe((statusesData: OrderStatusLookup[]) => {
        this.statuses = statusesData;
      });
  }

  private loadUsers(): void {
    this.users = [];
    this.lookupsService.loadUsers()
      .subscribe((usersData: OrderDataLookup[]) => {
        this.users = usersData;
      });

  }

  public clearFilters(): void {
    this.isClearingFilters = true;
    this.currentLine = '';
    this.currentArea = '';
    this.areas = [];
    this.currentDept = '';
    this.depts = [];
    this.currentMachine = '';
    this.machines = [];
    this.currentAssignee = '';
    this.currentStatus = '';
    this.isClearingFilters = false;
    this.description = '';
    this.orderNumber = '';
    this.orderDateFrom = null;
    this.orderDateTo = null;
  }

  public searchOrders(): void {
    this.filtersChanged.emit(this.getCurrentFilters());
  }

  public getCurrentFilters(): WorkOrdersSearchParameters {
    return {
      lineUuid: this._currentLine,
      areaUuid: this._currentArea,
      departmentUuid: this._currentDept,
      machineUuid: this._currentMachine,
      description: this.description,
      orderSequence: this.orderNumber,
      status: this._currentStatus,
      personnelUuid: this.currentAssignee,
      from: moment(this.orderDateFrom).format('YYYY-MM-DD'),
      to: moment(this.orderDateTo).format('YYYY-MM-DD')
    };
  }


}
