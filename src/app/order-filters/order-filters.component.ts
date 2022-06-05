import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { OrderDataLookup } from '../models/order-data-lookup.model';
import { WorkOrdersSearchRequestModel } from '../models/work-orders-search-request-model';
import { OrderLookupDataService } from '../services/order-lookup-data.service';

@Component({
  selector: 'app-order-filters',
  templateUrl: './order-filters.component.html',
  styleUrls: ['./order-filters.component.scss']
})
export class OrderFiltersComponent implements OnInit {

  private _currentLine: String = '';
  get currentLine(): String {
    return this._currentLine;
  }
  set currentLine(value: String) {
    this._currentLine = value;
    this.onLineChanged(value);
  }


  private _currentArea: String = '';
  get currentArea(): String {
    return this._currentArea;
  }
  set currentArea(value: String) {
    this._currentArea = value;
    this.onAreaChanged(value);
  }

  private _currentMachine: String = '';
  get currentMachine(): String {
    return this._currentMachine;
  }
  set currentMachine(value: String) {
    this._currentMachine = value;
  }

  private _currentDept: String = '';
  get currentDept(): String {
    return this._currentDept;
  }
  set currentDept(value: String) {
    this._currentDept = value;
    this.onDeptChanged(value);
  }

  currentAssignee: String;
  currentStatus: String;
  description: String = '';
  orderNumber: String = '';
  orderDateFrom: Date | null = null;
  orderDateTo: Date | null = null;

  lines: OrderDataLookup[] = [];
  areas: OrderDataLookup[] = [];
  depts: OrderDataLookup[] = [];
  machines: OrderDataLookup[] = [];
  users: OrderDataLookup[] = [];
  statuses: OrderDataLookup[] = [];

  private isClearingFilters = false;

  @Output() filtersChanged: EventEmitter<WorkOrdersSearchRequestModel> = new EventEmitter();

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

  onLineChanged(lineUuid: String): void {
    if (this.isClearingFilters) return;
    this.areas = [];
    this.currentArea = '';
    if (lineUuid) {
      this.lookupsService.loadLineAreas(lineUuid)
        .subscribe((areasData: OrderDataLookup[]) => {
          this.areas = areasData;
        });
    }
  }

  onAreaChanged(areaUuid: String): void {
    if (this.isClearingFilters) return;
    this.depts = [];
    this.currentDept = '';
    if (areaUuid) {
      this.lookupsService.loadAreadepts(areaUuid)
        .subscribe((deptsData: OrderDataLookup[]) => {
          this.depts = deptsData;
        });
    }
  }

  onDeptChanged(deptUuid: String) {
    if (this.isClearingFilters) return;
    this.machines = [];
    this.currentMachine = '';
    if (deptUuid) {
      this.lookupsService.loadDeptMachines(deptUuid)
        .subscribe((machinesData: OrderDataLookup[]) => {
          this.machines = machinesData;
        });
    }
  }

  private loadStatuses(): void {
    this.statuses = [];
    this.lookupsService.loadOrderStatuses()
      .subscribe((statusesData: OrderDataLookup[]) => {
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

  clearFilters(): void {
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

  searchOrders(): void {
    this.filtersChanged.emit(this.getCurrentFilters());
  }

  getCurrentFilters(): WorkOrdersSearchRequestModel {
    return {
      lineUuid: this._currentLine,
      areaUuid: this._currentArea,
      departmentUuid: this._currentDept,
      machineUuid: this._currentMachine,
      description: this.description,
      orderCode: this.orderNumber,
      status: this.currentStatus,
      personnelUuid: this.currentAssignee,
      from: this.orderDateFrom ? moment(this.orderDateFrom).format('YYYY-MM-DD') : null,
      to: this.orderDateTo ? moment(this.orderDateTo).format('YYYY-MM-DD') : this.orderDateFrom ? moment(this.orderDateFrom).format('YYYY-MM-DD') : null
    };
  }


}
