import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { FavoritesService } from 'src/app/shared/services/favorites/favorites.service';
import { GoodsService } from 'src/app/shared/services/goods/goods.service';
import { HeaderService } from 'src/app/shared/services/header/header.service';

@Component({
  selector: 'app-drinks',
  templateUrl: './drinks.component.html',
  styleUrls: ['./drinks.component.scss'],
})
export class DrinksComponent {
  public uid!: string;
  public favoriteProducts: string[] = [];
  public activeSection = 'drinks';
  public goodsArr: Array<GoodsResponse> = [];
  public activeItem: any;
  public user = '';

  constructor(
    private goodsService: GoodsService,
    private headerService: HeaderService,
    private toastr: ToastrService,
    private router: Router,
    private afs: Firestore,
    private favoritesService: FavoritesService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    // Отримати список товарів
    this.getGoods();

    const pageInfo = {
      title: this.activeSection,
    };
    this.headerService.emitPageInfo(pageInfo);

    //Отримання ID користувача
    const customer = JSON.parse(localStorage.getItem('curentUser') as string);
    if (customer && customer.uid) {
      this.uid = customer.uid;
    }
    if (this.uid) {
      this.favoritesService
        .getFavoritesByUser(this.uid)
        .subscribe((favorites) => {
          this.favoriteProducts = favorites.map(
            (favorite) => favorite.productId
          );
        });
    }
  }

  //ТОВАРИ
  // Отримати список товарів
  getGoods(): void {
    this.goodsService.getAll().subscribe((data) => {
      this.goodsArr = data.filter(
        (item) => item.menu.menuLink === this.activeSection
      );
    });
  }

  //посилання на товар
  productInfo(poduct: any): void {
    const productId = poduct.id;
    this.router.navigate(['/product-info', { id: productId }]);
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  // Перевірка, чи є товар у списку улюблених користувача
  isFavorite(product: any): boolean {
    return this.favoriteProducts.includes(product.id);
  }

  //додати в обране
  addFavorites(poduct: any): void {
    const productId = poduct.id;

    if (this.isFavorite(poduct)) {
      this.favoritesService
        .removeFromFavorites(this.uid, productId)
        .then(() => {
          this.favoriteProducts = this.favoriteProducts.filter(
            (favProductId) => favProductId !== productId
          );
        });
    } else {
      this.favoritesService.addToFavorites(this.uid, productId).then(() => {
        this.favoriteProducts.push(productId);
      });
    }
  }

  //КОШИК
  // Зміна кількості товарів в кошику
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
  }

  // Додавання товару до кошика
  addToBasket(goods: GoodsResponse): void {
    let basket: Array<GoodsResponse> = [];
    if (this.user === 'ADMIN') {
      this.toastr.warning(
        'Адміністратор не може робити замовлення, увійдіть або зареєструйтесь '
      );
    } else {
      if (localStorage.length > 0 && localStorage.getItem('basket')) {
        basket = JSON.parse(localStorage.getItem('basket') as string);

        if (basket.some((good) => good.id === goods.id)) {
          const index = basket.findIndex((good) => good.id === goods.id);
          basket[index].count += goods.count;
          basket[index].priceTogether = goods.price * basket[index].count;
        } else {
          basket.push(goods);
        }
      } else {
        basket.push(goods);
        this.headerService.updateBasketData(basket);
      }

      goods.priceTogether = goods.price;
      localStorage.setItem('basket', JSON.stringify(basket));
      goods.count = 1;
      this.headerService.updateBasketData(basket);
    }
  }
}
