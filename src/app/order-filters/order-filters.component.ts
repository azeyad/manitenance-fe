import { Component, OnInit } from '@angular/core';
import { OrderDataLookup } from '../models/order-data-lookup.model';
import { OrderLookupDataService } from '../services/order-lookup-data.service';

@Component({
  selector: 'app-order-filters',
  templateUrl: './order-filters.component.html',
  styleUrls: ['./order-filters.component.css']
})
export class OrderFiltersComponent implements OnInit {

  currentLine: String = '';
  currentArea: String = '';
  currentMachine: String = '';
  currentDept: String = '';
  currentAssignee: String = '';
  currentStatus: String = '';
  description: String = '';
  orderNumber: String = '';

  lines: OrderDataLookup[] = [];
  areas: OrderDataLookup[] = [];
  depts: OrderDataLookup[] = [];
  machines: OrderDataLookup[] = [];
  users: OrderDataLookup[] = [];
  statuses: String[] = [];

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
    this.areas = [];
    this.lookupsService.loadLineAreas(lineUuid)
      .subscribe((areasData: OrderDataLookup[]) => {
        this.areas = areasData;
      });
  }

  public onAreaChanged(areaUuid: string): void {
    this.depts = [];
    this.lookupsService.loadAreadepts(areaUuid)
      .subscribe((deptsData: OrderDataLookup[]) => {
        this.depts = deptsData;
      });
  }

  public onDeptChanged(deptUuid: String) {
    this.machines = [];
    this.lookupsService.loadDeptMachines(deptUuid)
      .subscribe((machinesData: OrderDataLookup[]) => {
        this.machines = machinesData;
      });
  }

  private loadStatuses(): void {
    this.statuses = [];
    this.lookupsService.loadOrderStatuses()
      .subscribe((statusesData: String[]) => {
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

}
