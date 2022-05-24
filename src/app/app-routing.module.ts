import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewOrderComponent } from './new-order/new-order.component';
import { OrdersSearchComponent } from './orders-search/orders-search.component';

const routes: Routes = [
  { path: '', component: OrdersSearchComponent },
  { path: 'search', component: OrdersSearchComponent },
  { path: 'new', component: NewOrderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
