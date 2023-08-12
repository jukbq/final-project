import { Component, ElementRef } from '@angular/core';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { CategoriesService } from 'src/app/shared/services/categories/categories.service';
import { GoodsService } from 'src/app/shared/services/goods/goods.service';
import { HeaderService } from 'src/app/shared/services/header/header.service';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.scss'],
})
export class PizzaComponent {
  constructor(

    
    private el: ElementRef,
    private headerService: HeaderService,
    private categoriesService: CategoriesService,
    private goodsService: GoodsService
  ) {}

  public listCategory: any[] = []
  public goodsArr: Array<GoodsResponse> = [];
  public categoryName!: string;
  public activeItem: any;

  ngOnInit(): void {
    this.addInitialAllCategory(); // Додаємо категорію "Всі" перед завантаженням даних
    this.getCategory(); // Отримати список категорій
    this.headerService.headerClick$.subscribe(() => {
      this.scrollToPizzaContainer(); // Під час кліку на заголовок перехід до списку товарів
    });
    this.getGoods(); // Отримати всі товари (початковий стан)
  }

  // Отримати список категорій
  getCategory() {
    this.categoriesService.getAll().subscribe((data) => {
      this.listCategory = [...this.listCategory, ...data]; // Додати категорії до списку

    });
  }

  // Вибір категорії зі списку
  onSelectItem(category: any): void {
    this.activeItem = category;
    this.categoryName = category.link;
    console.log(this.categoryName);

    if (this.categoryName === 'all') {
      this.getGoods(); // Отримати всі товари "Піца"
    } else {
      this.getGoodsByCategory(this.categoryName); // Отримати товари за обраною категорією
    }
  }

  // Отримати всі товари "Піца"
  getGoods(): void {
    this.goodsService.getAll().subscribe((data) => {
      this.goodsArr = data.filter((item) => item.menu.menuName === 'Піца');
    });
  }

  // Отримати товари за обраною категорією "Піца"
  getGoodsByCategory(categoryName: string): void {
    this.goodsService.getAll().subscribe((data) => {
      this.goodsArr = data.filter(
        (good: GoodsResponse) =>
          good.category &&
          good.category.link === categoryName &&
          good.menu.menuName === 'Піца'
      );
    });
  }

  // Змінити кількість товару
  quantity_goods(good: GoodsResponse, value: boolean): void {
    if (value) {
      ++good.count;
    } else if (!value && good.count > 1) {
      --good.count;
    }
  }

  // Додати товар до кошика
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

  // Прокрутити до списку товарів
  scrollToPizzaContainer() {
    const pizzaContainer: HTMLElement =
      this.el.nativeElement.querySelector('#pizza-container');
    const actionСonteiner: HTMLElement | null =
      document.querySelector('.action-conteiner');

    if (pizzaContainer && actionСonteiner) {
      const actionrHeight = actionСonteiner.offsetHeight;
      const winScrool = window.scrollY;
      const scrool = actionrHeight - winScrool;
      pizzaContainer.style.transition = `transform var(--transition)`;
      window.scrollBy({
        top: scrool,
        behavior: 'smooth',
      });
    }
  }

  // Додати категорію "Всі" до списку категорій
  addInitialAllCategory() {
    const allCategory = this.createAllCategoriesObject();
    this.listCategory.push(allCategory);
  }

  // Створити об'єкт категорії "Всі"
  createAllCategoriesObject(): any {
    const allCategory = {
      link: 'all',
      titel: 'Всі',
      id: 0,
      images: '',
      menu: {
        menulink: 'pizza',
        menuName: 'Піца',
        id: 0,
      },
    };

    return allCategory;
  }
}
