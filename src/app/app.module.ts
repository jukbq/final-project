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
import { SaladsComponent } from './modules/salads/salads.component';
import { DessertsComponent } from './modules/desserts/desserts.component';
import { DrinksComponent } from './modules/drinks/drinks.component';
import { SignupComponent } from './modals-win/signup/signup.component';
import { SigninComponent } from './modals-win/signin/signin.component';
import { BasketComponent } from './modals-win/basket/basket.component';
import { AdressComponent } from './modals-win/adress/adress.component';
import { PizzaComponent } from './modules/pizza/pizza.component';
import { MatSliderModule } from '@angular/material/slider';
import { SlickCarouselModule } from 'ngx-slick-carousel';


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
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    MatSliderModule,
    SlickCarouselModule,
    SharedModule,
  ],
  providers: [ScreenTrackingService, UserTrackingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
