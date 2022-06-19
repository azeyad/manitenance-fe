import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { OrderDataLookup } from '../models/order-data-lookup.model';
import { WorkOrdersCreateRequestModel } from '../models/work-orders-create-request-model';
import { OrderLookupDataService } from '../services/order-lookup-data.service';

@Component({
  selector: 'app-order-properties',
  templateUrl: './order-properties.component.html',
  styleUrls: ['./order-properties.component.scss']
})
export class OrderPropertiesComponent implements OnInit {

  @ViewChild('orderForm', { read: NgForm }) orderForm: NgForm;

  private _currentLine: String;
  @Input()
  get currentLine(): String {
    return this._currentLine;
  }
  set currentLine(value: String) {
    this._currentLine = value;
    this.onLineChanged();
  }

  private _currentArea: String;
  @Input()
  get currentArea(): String {
    return this._currentArea;
  }
  set currentArea(value: String) {
    this._currentArea = value;
    this.onAreaChanged();
  }

  private _currentMachine: String;
  @Input()
  get currentMachine(): String {
    return this._currentMachine;
  }
  set currentMachine(value: String) {
    this._currentMachine = value;
  }

  private _currentDept: String;
  @Input()
  get currentDept(): String {
    return this._currentDept;
  }
  set currentDept(value: String) {
    this._currentDept = value;
    this.onDeptChanged();
  }

  @Input()
  currentAssignee: String;
  @Input()
  currentStatus: String;
  @Input()
  description: String;
  @Input()
  orderNumber: String;
  private _orderDate: Date = new Date(moment.now());
  @Input()
  set orderDate(value) {    
    const offset = moment().utcOffset();
    value = moment.utc(value).utcOffset(offset).toDate();
    this._orderDate = new Date(value);
  }
  get orderDate(): Date {
    return this._orderDate;
  }

  lines: OrderDataLookup[] = [];
  areas: OrderDataLookup[] = [];
  depts: OrderDataLookup[] = [];
  machines: OrderDataLookup[] = [];
  users: OrderDataLookup[] = [];
  statuses: OrderDataLookup[] = [];

  constructor(private lookupsService: OrderLookupDataService) {

  }

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


  private onLineChanged(): void {
    if (this.areas.length > 0) {
      this._currentArea = '';
      this.onAreaChanged();
    }
    this.areas = [];
    if (this._currentLine) {
      this.lookupsService.loadLineAreas(this._currentLine)
        .subscribe((areasData: OrderDataLookup[]) => {
          this.areas = areasData;
        });
    }
  }

  private onAreaChanged(): void {
    if (this.depts.length > 0) {
      this._currentDept = '';
      this.onDeptChanged();
    }
    this.depts = [];
    if (this._currentArea) {
      this.lookupsService.loadAreadepts(this._currentArea)
        .subscribe((deptsData: OrderDataLookup[]) => {
          this.depts = deptsData;
        });
    }
  }

  private onDeptChanged() {
    if (this.machines.length > 0) {
      this.currentMachine = '';
    }
    this.machines = [];
    if (this.currentDept) {
      this.lookupsService.loadDeptMachines(this.currentDept)
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

  getOrderCreateRequestModel(): WorkOrdersCreateRequestModel {
    const model: WorkOrdersCreateRequestModel = {
      description: this.description,
      creationDate: this.orderDate ? moment(this.orderDate).toISOString() : '',
      machineUuid: this._currentMachine,
      orderStatus: this.currentStatus,
      assigneeUuid: this.currentAssignee
    }
    return model;
  }

  isValid(): boolean {
    return this.orderForm && this.orderForm.valid ? true : false;
  }

  isChanged(): boolean {
    return !this.orderForm.pristine;
  }
}
