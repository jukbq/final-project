import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { PizzaComponent } from '../pizza/pizza.component';




const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children:[
  {path:'pizza', component: PizzaComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
