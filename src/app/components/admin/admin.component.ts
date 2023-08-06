import { Component } from '@angular/core';
import { Router } from '@angular/router';

const LIST: any[] = [
  { name: 'АКЦІЇ', link: 'action' },
  { name: 'КАТЕГОРІЇ', link: 'categories' },
  { name: 'ТОВАРИ', link: 'goods' },
  { name: 'ДОДАТКОВІ ТОВАРИ', link: 'additional-products' },
  { name: 'ЗАМОВЛЕННЯ', link: 'order' },
];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  public list: any[] = LIST;
  public activeItem: any;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onSelectItem(item: string): void {
    console.log(item)
    this.activeItem = item;
  }

  logout() {
    this.router.navigate(['/']);
    localStorage.removeItem('curentUser');
    window.location.reload();
  }
}
