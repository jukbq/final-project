import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritesService } from 'src/app/shared/services/favorites/favorites.service';

const LIST: any[] = [
  { name: 'ОСОБИСТІ ДАНІ', link: 'personal-data' },
  { name: 'ІСТОРІЯ ЗАМОВЛЕНЬ', link: 'order-history' },
  { name: 'ЗМІНА ПАРОЛЮ', link: 'password-change' },
  { name: 'улюблені', link: 'favorite' },
];

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  public list: any[] = LIST;
  public activeItem: any;
  public isSmallScreen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
 const windowWidth = window.innerWidth;
     if (windowWidth <= 524) {
       this.isSmallScreen = true;
     } else {
       this.isSmallScreen = false;
     }
  }

  onSelectItem(item: string): void {
      this.activeItem = item;
   
   
  }


}
