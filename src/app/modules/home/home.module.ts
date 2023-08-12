import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSliderModule } from '@angular/material/slider';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PizzaComponent } from '../pizza/pizza.component';



@NgModule({
  declarations: [HomeComponent, PizzaComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatSliderModule,
    SharedModule,
    SlickCarouselModule,
  ],
})
export class HomeModule {}
