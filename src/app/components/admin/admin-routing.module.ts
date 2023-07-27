import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminActionsComponent } from './admin-actions/admin-actions.component';
import { AdminCategoriesComponent } from './admin-categories/admin-categories.component';
import { AdminGoodsComponent } from './admin-goods/admin-goods.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'action', component: AdminActionsComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'goods', component: AdminGoodsComponent },
      { path: 'order', component: AdminOrderComponent },
      { path: '', pathMatch: 'full', redirectTo: 'action' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
