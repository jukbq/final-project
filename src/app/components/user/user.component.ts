import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onSelectItem(item: string): void {
    this.activeItem = item;
  }

  
}
