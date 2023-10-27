import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { ToastrModule } from 'ngx-toastr';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import {
  provideRemoteConfig,
  getRemoteConfig,
} from '@angular/fire/remote-config';
import { SignupComponent } from './modals-win/signup/signup.component';
import { SigninComponent } from './modals-win/signin/signin.component';
import { BasketComponent } from './modals-win/basket/basket.component';
import { AdressComponent } from './modals-win/adress/adress.component';
import { MatSliderModule } from '@angular/material/slider';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PizzaComponent } from './modules/goods-pages/pizza/pizza.component';
import { DessertsComponent } from './modules/goods-pages/desserts/desserts.component';
import { DrinksComponent } from './modules/goods-pages/drinks/drinks.component';
import { SaladsComponent } from './modules/goods-pages/salads/salads.component';
import { OrderComponent } from './modules/order/order.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HeaderService } from './shared/services/header/header.service';
import { ProductInfoComponent } from './modules/product-info/product-info.component';
import { DeliveryAndPaymentComponent } from './modules/about-company-pages/delivery-and-payment/delivery-and-payment.component';
import { ActionsComponent } from './modules/about-company-pages/actions/actions.component';
import { ContactsComponent } from './modules/about-company-pages/contacts/contacts.component';
import { VacanciesComponent } from './modules/about-company-pages/vacancies/vacancies.component';
import { NewsComponent } from './modules/about-company-pages/news/news.component';
import { AboutUsComponent } from './modules/about-company-pages/about-us/about-us.component';
import { ActionInfoComponent } from './modules/action-info/action-info.component';
import { AdditionalProductsComponent } from './modals-win/additional-products/additional-products.component';
import { OrderByPipe } from './shared/pipe/sort';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PizzaComponent,
    SaladsComponent,
    DessertsComponent,
    DrinksComponent,
    SignupComponent,
    SigninComponent,
    BasketComponent,
    AdressComponent,
    OrderComponent,
    ProductInfoComponent,
    AboutUsComponent,
    DeliveryAndPaymentComponent,
    ActionsComponent,
    ContactsComponent,
    VacanciesComponent,
    NewsComponent,
    ActionInfoComponent,
    AdditionalProductsComponent,
    OrderByPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    MatSliderModule,
    SlickCarouselModule,
    SharedModule,
  ],
  providers: [ScreenTrackingService, UserTrackingService, HeaderService,],
  bootstrap: [AppComponent],
})
export class AppModule { }
