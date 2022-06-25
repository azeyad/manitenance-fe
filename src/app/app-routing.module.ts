import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { LoginComponent } from './login/login.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { OrderAuditTrailComponent } from './order-audit-trail/order-audit-trail.component';
import { OrdersSearchComponent } from './orders-search/orders-search.component';

const routes: Routes = [
  { path: '', component: LoginComponent },  
  { path: 'login', component: LoginComponent },  
  { path: 'search', component: OrdersSearchComponent },
  { path: 'new', component: NewOrderComponent },
  { path: 'edit/:orderUuid', component: EditOrderComponent },
  { path: 'history/:orderUuid', component: OrderAuditTrailComponent },
  { path: 'history', component: OrderAuditTrailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
