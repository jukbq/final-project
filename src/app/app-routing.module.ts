import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { SignupComponent } from './modals-win/signup/signup.component';
import { SigninComponent } from './modals-win/signin/signin.component';
import { BasketComponent } from './modals-win/basket/basket.component';
import { PizzaComponent } from './modules/pizza/pizza.component';
import { SaladsComponent } from './modules/salads/salads.component';
import { DessertsComponent } from './modules/desserts/desserts.component';
import { DrinksComponent } from './modules/drinks/drinks.component';

const routes: Routes = [
  { path: '', component: PizzaComponent },
  { path: 'pizza', component: PizzaComponent },
  { path: 'salads', component: SaladsComponent },
  { path: 'desserts', component: DessertsComponent },
  { path: 'drinks', component: DrinksComponent },
  { path: 'sighup', component: SignupComponent },
  { path: 'sighin', component: SigninComponent },
  { path: 'basket', component: BasketComponent },

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
