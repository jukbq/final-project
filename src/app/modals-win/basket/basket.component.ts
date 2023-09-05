import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { OrderService } from 'src/app/shared/services/order/order.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
})
export class BasketComponent implements OnInit {
  public basket: Array<GoodsResponse> = [];
  public summ = 0;
  public count = 0;
  public bonus = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private renderer: Renderer2,
    private el: ElementRef,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<BasketComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {
    const cartElement = this.el.nativeElement.querySelector('.basket');
    if (cartElement && this.data.panelClass) {
      this.renderer.addClass(cartElement, this.data.panelClass);
    }
    this.addToBasket();
    this.updateBasket();
    this.summPrice();
    this.orderService.chageBasket.subscribe(() => {
      this.addToBasket();
      this.summPrice();
    });
  }

  addToBasket(): void {
    const basketData = localStorage.getItem('basket');
    if (basketData && basketData !== 'null') {
      this.basket = JSON.parse(basketData);
      this.summPrice();
      console.log(this.basket);
    }
  }

  updateBasket(): void {
    this.orderService.chageBasket.subscribe(() => this.addToBasket());
  }

  quantity_goods(good: GoodsResponse, value: boolean): void {
    if (value) {
      ++good.count;
      good.newPrice = true;
      good.priceTogether = good.price * good.count;
      good.bonusTogether = good.bonus * good.count;
    } else if (!value && good.count > 1) {
      --good.count;
      good.priceTogether -= good.price;
      good.bonusTogether -= good.bonus;
    }
    this.updateLocalStorage();
  }

  summPrice(): void {
    this.summ = this.basket.reduce(
      (totalSum: number, good: GoodsResponse) =>
        totalSum + good.count * good.price,
      0
    );
    this.count = this.basket.reduce(
      (totalCount: number, goods: GoodsResponse) => totalCount + goods.count,
      0
    );
    this.bonus = this.basket.reduce(
      (totalBonus: number, good: GoodsResponse) =>
        totalBonus + good.count * good.bonus,
      0
    );
  
  }

  delOrder(order: any) {
    let index = this.basket.findIndex((item) => item.id === order.id);
    if (index !== -1) {
      this.basket.splice(index, 1);

      if (this.basket.length === 0) {
        localStorage.removeItem('basket');
      } else {
        this.updateLocalStorage();
      }

      this.orderService.chageBasket.next(true);
      this.dialogRef.beforeClosed();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  updateLocalStorage(): void {
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.summPrice();
  }

  addOrder() {
    this.dialogRef.close();
    this.router.navigate(['order']);
  }
}
