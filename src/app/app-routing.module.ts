import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { SignupComponent } from './modals-win/signup/signup.component';
import { SigninComponent } from './modals-win/signin/signin.component';
import { BasketComponent } from './modals-win/basket/basket.component';
import { PizzaComponent } from './modules/goods-pages/pizza/pizza.component';
import { SaladsComponent } from './modules/goods-pages/salads/salads.component';
import { DessertsComponent } from './modules/goods-pages/desserts/desserts.component';
import { DrinksComponent } from './modules/goods-pages/drinks/drinks.component';
import { OrderComponent } from './modules/order/order.component';
import { ProductInfoComponent } from './modules/product-info/product-info.component';
import { AboutUsComponent } from './modules/about-company-pages/about-us/about-us.component';
import { ActionsComponent } from './modules/about-company-pages/actions/actions.component';
import { ContactsComponent } from './modules/about-company-pages/contacts/contacts.component';
import { DeliveryAndPaymentComponent } from './modules/about-company-pages/delivery-and-payment/delivery-and-payment.component';
import { NewsComponent } from './modules/about-company-pages/news/news.component';
import { VacanciesComponent } from './modules/about-company-pages/vacancies/vacancies.component';
import { ActionInfoComponent } from './modules/action-info/action-info.component';


const routes: Routes = [
  { path: '', component: PizzaComponent },
  { path: 'pizza', component: PizzaComponent },
  { path: 'salads', component: SaladsComponent },
  { path: 'desserts', component: DessertsComponent },
  { path: 'drinks', component: DrinksComponent },
  { path: 'sighup', component: SignupComponent },
  { path: 'sighin', component: SigninComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'order', component: OrderComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'actions', component: ActionsComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'delivery-and-payment', component: DeliveryAndPaymentComponent },
  { path: 'news', component: NewsComponent },
  { path: 'vacancies', component: VacanciesComponent },
  { path: 'action-info', component: ActionInfoComponent },

  {
    path: 'product-info',
    component: ProductInfoComponent,
  },

  {
    path: 'admin',

    loadChildren: () =>
      import('./components/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'user',

    loadChildren: () =>
      import('./components/user/user.module').then((m) => m.UserModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
