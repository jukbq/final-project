import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { CategoriesService } from 'src/app/shared/services/categories/categories.service';
import { FavoritesService } from 'src/app/shared/services/favorites/favorites.service';
import { GoodsService } from 'src/app/shared/services/goods/goods.service';
import { HeaderService } from 'src/app/shared/services/header/header.service';

@Component({
  selector: 'app-salads',
  templateUrl: './salads.component.html',
  styleUrls: ['./salads.component.scss'],
})
export class SaladsComponent {
  public uid!: string;
  public favoriteProducts: string[] = [];
  public activeSection = 'salads';
  public goodsArr: Array<GoodsResponse> = [];
  public listCategory: any[] = [];
  public activeItem: any;
  public categoryName!: string;
  public user = '';

  constructor(
    private categoriesService: CategoriesService,
    private goodsService: GoodsService,
    private headerService: HeaderService,
    private toastr: ToastrService,
    private router: Router,
    private afs: Firestore,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.addInitialAllCategory();
    // Отримати список товарів
    this.getGoods();
    // Отримати список категорій
    this.getCategory();
    const pageInfo = {
      title: this.activeSection,
    };

    this.headerService.emitPageInfo(pageInfo);

    //Отримання ID користувача
    const customer = JSON.parse(localStorage.getItem('curentUser') as string);
    this.uid = customer.uid;

    this.favoritesService
      .getFavoritesByUser(this.uid)
      .subscribe((favorites) => {
        this.favoriteProducts = favorites.map((favorite) => favorite.productId);
            });
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

  productInfo(poduct: any): void {
    const productId = poduct.id;
    this.router.navigate(['/product-info', { id: productId }]);
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

  //КАТЕГОРІЇ
  // Створити об'єкт для "Всі категорії"
  createAllCategoriesObject(): any {
    const allCategory = {
      link: 'all',
      titel: 'Всі',
      id: 0,
      images: '',
      menu: {
        menuLink: 'salads',
        menuName: 'Салати',
        id: 0,
      },
    };

    return allCategory;
  }
  // Отримати список категорій
  getCategory() {
    this.categoriesService.getAll().subscribe((data) => {
      for (const category of data) {
        const hasGoodsWithCategory = this.goodsArr.some(
          (goods) => goods.category && goods.category.link === category['link']
        );
        if (hasGoodsWithCategory) {
          this.listCategory.push(category);
        }
      }
    });
  }

  categoryHasGoods(categoryLink: string): boolean {
    return this.goodsArr.some(
      (goods) => goods.category && goods.category.link === categoryLink
    );
  }

  // Отримати товари за обраною категорією
  getGoodsByCategory(categoryName: string): void {
    this.goodsService.getAll().subscribe((data) => {
      this.goodsArr = data.filter(
        (goods: GoodsResponse) =>
          goods.category &&
          goods.category.link === categoryName &&
          goods.menu.menuLink === this.activeSection
      );
    });
  }

  // Вибрати категорію
  onSelectItem(category: any): void {
    this.activeItem = category;
    this.categoryName = category.link;
    if (this.categoryName === 'all') {
      this.getGoods();
    } else {
      this.getGoodsByCategory(this.categoryName);
    }
  }

  // Додати початковий елемент "Всі категорії"
  addInitialAllCategory() {
    const allCategory = this.createAllCategoriesObject();
    this.listCategory.push(allCategory);
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
        } else {
          basket.push(goods);
        }
      } else {
        basket.push(goods);
      }

      localStorage.setItem('basket', JSON.stringify(basket));
      goods.count = 1;
      this.headerService.updateBasketData(basket);
    }
  }
}
