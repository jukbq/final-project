import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./modules/home/home.component";
import { SignupComponent } from './modals-win/signup/signup.component';
import { SigninComponent } from './modals-win/signin/signin.component';
import { BasketComponent } from './modals-win/basket/basket.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  
  { path: 'sighup', component: SignupComponent },
  { path: 'sighin', component: SigninComponent },
  { path: 'basket', component: BasketComponent },

  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./components/admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
