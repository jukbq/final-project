import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { FavoriteComponent } from './favorite/favorite.component';

@NgModule({
  declarations: [
    UserComponent,
    PersonalDataComponent,
    OrderHistoryComponent,
    PasswordChangeComponent,
    FavoriteComponent,
  ],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
