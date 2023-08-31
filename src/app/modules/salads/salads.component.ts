import { Component } from '@angular/core';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { CategoriesService } from 'src/app/shared/services/categories/categories.service';
import { GoodsService } from 'src/app/shared/services/goods/goods.service';
import { HeaderService } from 'src/app/shared/services/header/header.service';

@Component({
  selector: 'app-salads',
  templateUrl: './salads.component.html',
  styleUrls: ['./salads.component.scss'],
})
export class SaladsComponent {
  constructor(
    private categoriesService: CategoriesService,
    private goodsService: GoodsService,
    private headerService: HeaderService,
  ) {}

  public activeSection = 'salads';
  public goodsArr: Array<GoodsResponse> = [];
  public listCategory: any[] = [];
  public activeItem: any;
  public categoryName!: string;

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
    } else if (!value && good.count > 1) {
      --good.count;
    }
  }

  // Додавання товару до кошика
  addToBasket(goods: GoodsResponse): void {
    let basket: Array<GoodsResponse> = [];

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
  }
}
