import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminActionsComponent } from './admin-actions/admin-actions.component';
import { AdminComponent } from './admin.component';
import { AdminCategoriesComponent } from './admin-categories/admin-categories.component';
import { AdminGoodsComponent } from './admin-goods/admin-goods.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';
import { AdminAdditionalProductsComponent } from './admin-additional-products/admin-additional-products.component';



@NgModule({
  declarations: [
    AdminComponent,
    AdminActionsComponent,
    AdminCategoriesComponent,
    AdminGoodsComponent,
    AdminOrderComponent,
    AdminAdditionalProductsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
