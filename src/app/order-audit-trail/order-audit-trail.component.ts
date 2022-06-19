import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { finalize } from 'rxjs';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { AuditTrailModel } from '../models/audit-trail-model';
import { WorkOrdersDataService } from '../services/work-orders-data.service';

@Component({
  selector: 'app-order-audit-trail',
  templateUrl: './order-audit-trail.component.html',
  styleUrls: ['./order-audit-trail.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderAuditTrailComponent implements OnInit {
  dataSource: AuditTrailModel[] = [];
  auditModelColumns = ['detailsExpand', 'user', 'action', 'orderCode', 'dateTime'];
  auditDetailsColumns = ['propertyName', 'previousValue', 'currentValue'];
  expandedAuditModel: AuditTrailModel | null;
  isLoading = false;
  orderNumber: String = '';

  private orderUuid: String;
  constructor(private route: ActivatedRoute, private orderDataService: WorkOrdersDataService, private snackBar: MatSnackBar, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    const orderUuidRouteParam = this.route.snapshot.paramMap.get('orderUuid');
    if (orderUuidRouteParam) {
      this.isLoading = true;
      this.orderUuid = orderUuidRouteParam;
      this.orderDataService.getOrderAuditTrailsByOrderUuid(this.orderUuid).pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (auditTrails: AuditTrailModel[]) => {
            this.dataSource = auditTrails;
            this.orderNumber = auditTrails[0].orderCode;
          },
          error: (error: HttpErrorResponse) => this.handleGetAuditTrailRequestError(error)
        });
    }
  }

  expandAudotDetails(element: AuditTrailModel) {
    this.expandedAuditModel = this.expandedAuditModel === element ? null : element;
  }

  clearFilters() {
    this.orderNumber = '';
  }

  searchHistory() {
    this.dataSource = [];
    this.isLoading = true;
    this.orderDataService.getOrderAuditTrailsByOrderCode(this.orderNumber).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (auditTrails: AuditTrailModel[]) => this.dataSource = auditTrails,
        error: (error: HttpErrorResponse) => this.handleGetAuditTrailRequestError(error)
      });
  }

  private handleGetAuditTrailRequestError(error: HttpErrorResponse) {
    if (error.status === HttpStatusCode.NotFound) {
      this.dialog.open(InfoDialogComponent, {
        data: {
          message: `No hisotry was found for this work order`
        }
      });
    } else {
      this.snackBar.open("Failed to load order audit info.", "Error");
    }
  }

  formatOrderDate(auditModel: AuditTrailModel) {
    const offset = moment().utcOffset();
    return moment.utc(auditModel.dateTime).utcOffset(offset).format("L LT");
  }

}

