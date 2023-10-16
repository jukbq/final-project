import { ViewportScroller } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActionResponse } from 'src/app/shared/interfaces/action';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { ActionService } from 'src/app/shared/services/action/action.service';
import { CategoriesService } from 'src/app/shared/services/categories/categories.service';
import { FavoritesService } from 'src/app/shared/services/favorites/favorites.service';
import { GoodsService } from 'src/app/shared/services/goods/goods.service';
import { HeaderService } from 'src/app/shared/services/header/header.service';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.css'],
})
export class PizzaComponent {
  public uid!: string;
  public favoriteProducts: string[] = [];
  public listCategory: any[] = [];
  public slides: Array<ActionResponse> = [];
  public goodsArr: Array<GoodsResponse> = [];
  public activeSection = 'pizza';
  public categoryName!: string;
  public activeItem: any;
  public menuName: any;
  public newPrice = false;
  public user = '';
  public isExpanded = false;
  public scrool = '';
  public benefits = false;

  constructor(
    private actionService: ActionService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef,
    private headerService: HeaderService,
    private categoriesService: CategoriesService,
    private goodsService: GoodsService,
    private toastr: ToastrService,
    private afs: Firestore,
    private favoritesService: FavoritesService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    // Підписка на подію кліку в хедері
    this.headerService.headerClick$.subscribe((menuItem) => {
      this.scrollToPizzaContainer(menuItem);
      this.getGoods();
    });

    if (this.activeSection === 'pizza') {
      this.route.fragment.subscribe((fragment: string | null) => {
        if (fragment) {
          this.scrollToPizzaContainer(fragment);
          this.getGoods();
        }
      });
    }
    const pageInfo = {
      title: this.activeSection,
    };

    this.headerService.emitPageInfo(pageInfo);

    this.addInitialAllCategory();
    this.getActions();
    // Отримати список товарів
    this.getGoods();
    // Отримати список категорій
    this.getCategory();
    this.currentUser();

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

    const windowWidth = window.innerWidth;

    if (windowWidth <= 524) {
      this.benefits = true;
    } else {
      this.benefits = false;
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
  productInfo(poduct: any): void {
    const productId = poduct.id;
    this.router.navigate(['/product-info', { id: productId }]);
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  currentUser() {
    const currentUserString = localStorage.getItem('curentUser');

    if (currentUserString) {
      const userRole = JSON.parse(currentUserString);
      this.user = userRole.role;
    }
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
        menuLink: 'pizza',
        menuName: 'Піца',
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
          basket[index].priceTogether = goods.price * basket[index].count;
        } else {
          basket.push(goods);
        }
      } else {
        basket.push(goods);
      }
      goods.priceTogether = goods.price;
      localStorage.setItem('basket', JSON.stringify(basket));
      goods.count = 1;
      this.headerService.updateBasketData(basket);
    }
  }

  //АКЦІЇ
  // Отримати список акцій
  getActions(): void {
    this.actionService.getAll().subscribe((data) => {
      this.slides = data;
    });
  }

  // Налаштування слайдера
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    fade: true,
    autoplay: false,
    autoplaySpeed: 3000,
    dots: true,
    arrows: true,
    swipe: true,
  };

  benefitsConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    fade: true,
    autoplay: false,
    dots: true,
    arrows: true,
    swipe: true,
  };

  // Видалення слайда
  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  // Ініціалізація слайдера
  onCarouselInit(event: any) {
    const battocontainer = document.querySelector('.batton-container');
    const slickprev = document.querySelector('.slick-prev');
    const slickdots = document.querySelector('.slick-dots');
    const slicknext = document.querySelector('.slick-next');

    if (battocontainer instanceof Element) {
      slickprev!.innerHTML = `
        <i>
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 8.00004V5.33004C1 2.02005 3.35 0.660045 6.22 2.32005L8.53 3.66004L10.84 5.00004C13.71 6.66004 13.71 9.37004 10.84 11.03L8.53 12.37L6.22 13.71C3.35 15.34 1 13.99 1 10.67V8.00004Z" stroke-width="1.5"></path>
          </svg>
        </i>
      `;

      slicknext!.innerHTML = `
        <i>
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 8.00004V5.33004C1 2.02005 3.35 0.660045 6.22 2.32005L8.53 3.66004L10.84 5.00004C13.71 6.66004 13.71 9.37004 10.84 11.03L8.53 12.37L6.22 13.71C3.35 15.34 1 13.99 1 10.67V8.00004Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </i>
      `;

      battocontainer.appendChild(slickprev!);
      battocontainer.appendChild(slickdots!);
      battocontainer.appendChild(slicknext!);
    }
  }

  // Прокрутка до контейнера піци
  async scrollToPizzaContainer(menuItem: any) {
    this.activeSection = menuItem;
    const goodsContainer: HTMLElement =
      this.el.nativeElement.querySelector('#goods');
    const actionСonteiner: HTMLElement | null =
      document.querySelector('.action-conteiner');
    const headerBottom: HTMLElement | null =
      document.querySelector('.header-bottom');

    if (menuItem === 'pizza' && actionСonteiner && headerBottom) {
      const actionrHeight = actionСonteiner.offsetHeight;
      const headerBottomHeight = headerBottom.offsetHeight;
      console.log(headerBottomHeight);

      const winScrool = window.scrollY;
      const scrool = headerBottomHeight + actionrHeight - winScrool;
      actionСonteiner.classList.remove('visible');
      goodsContainer.style.transition = `transform var(--transition)`;
      window.scrollBy({
        top: scrool,
        behavior: 'smooth',
      });
    } else if (actionСonteiner) {
      actionСonteiner.classList.add('visible');
      goodsContainer.style.marginTop = '10px';
      window.scrollBy({
        top: -window.scrollY,
        behavior: 'smooth',
      });
    }
  }

  toggleContent() {
    this.isExpanded = !this.isExpanded;
  }
}
