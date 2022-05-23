import { Component, OnInit } from '@angular/core';
import { OrderDataLookup } from '../models/order-data-lookup.model';
import { OrderLookupDataService } from '../services/order-lookup-data.service';

@Component({
  selector: 'app-order-properties',
  templateUrl: './order-properties.component.html',
  styleUrls: ['./order-properties.component.css']
})
export class OrderPropertiesComponent implements OnInit {

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

  currentAssignee: String = '';
  currentStatus: String = '';
  description: String = '';
  orderNumber: String = '';

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


  onLineChanged(lineUuid: String): void {
    this.areas = [];
    this.currentArea = '';
    this.onAreaChanged('');
    if (lineUuid) {
      this.lookupsService.loadLineAreas(lineUuid)
        .subscribe((areasData: OrderDataLookup[]) => {
          this.areas = areasData;
        });
    }
  }

  onAreaChanged(areaUuid: String): void {
    this.depts = [];
    this.currentDept = '';
    this.onDeptChanged('');
    if (areaUuid) {
      this.lookupsService.loadAreadepts(areaUuid)
        .subscribe((deptsData: OrderDataLookup[]) => {
          this.depts = deptsData;
        });
    }
  }

  onDeptChanged(deptUuid: String) {
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

  cancel(): void {

  }

  addNotes(): void {

  }

  addFiles(): void {

  }

  submit(): void {
    alert(this.currentLine +","+ this.currentArea +","+ this.currentDept +","+ this.currentMachine);
  }

}
