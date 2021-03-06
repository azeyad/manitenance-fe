import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderFiltersComponent } from './order-filters/order-filters.component';
import { OrderPropertiesComponent } from './order-properties/order-properties.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule, MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrdersSearchComponent } from './orders-search/orders-search.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FilesUploadComponent } from './files-upload/files-upload.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { ReleaseOrderComponent } from './release-order/release-order.component';
import { OrderAuditTrailComponent } from './order-audit-trail/order-audit-trail.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NewOrderComponent,
    EditOrderComponent,
    OrdersListComponent,
    OrderFiltersComponent,
    OrderPropertiesComponent,
    OrdersSearchComponent,
    ConfirmationDialogComponent,
    HeaderComponent,
    FooterComponent,
    FilesUploadComponent,
    ImageViewerComponent,
    ReleaseOrderComponent,
    OrderAuditTrailComponent,
    InfoDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCommonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTabsModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
