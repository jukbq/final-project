import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BasketComponent } from 'src/app/modals-win/basket/basket.component';
import { SigninComponent } from 'src/app/modals-win/signin/signin.component';
import { ROLE } from 'src/app/shared/guards/role.constant';
import { GoodsResponse } from 'src/app/shared/interfaces/goods';
import { MenuResponse } from 'src/app/shared/interfaces/menu';
import { FavoritesService } from 'src/app/shared/services/favorites/favorites.service';
import { HeaderService } from 'src/app/shared/services/header/header.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';

const LIST: any[] = [
  { name: 'Про нас', link: 'about-us' },
  { name: 'Доставка та оплата', link: 'delivery-and-payment' },
  { name: 'Акції', link: 'actions' },
  { name: 'Контакти', link: 'contacts' },
  { name: 'Вакансії', link: 'vacancies' },
  { name: 'Новини', link: 'news' },
];


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public list: any[] = LIST;
  private basket: Array<GoodsResponse> = [];
  private basketSubscription!: Subscription;
  public favoriteProducts: string[] = [];
  public favoritGoods = 0;
  public menuArr: Array<MenuResponse> = [];
  public menuLink = 'pizza';
  public isLogin = false;
  public loginUrl = '';
  public activeUserMenu = false;
  public fullName = '';
  public summ = 0;
  public count = 0;

  constructor(
    private el: ElementRef,
    private router: Router,
    private headerService: HeaderService,
    private menuService: MenuService,
    public dialog: MatDialog,
    private afs: Firestore,
    private favoritesService: FavoritesService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.changeUserUrl();
    this.getMenu();
    this.addToBasket();
    this.headerService.pageInfo$.subscribe((pageInfo) => {
      this.menuLink = pageInfo.title;
    });

    this.basketSubscription = this.headerService.basketData$.subscribe(
      (newBasketData) => {
        if (newBasketData.length !== 0) {
          this.basket = newBasketData;
          this.summPrice();
        } else {
          this.basket = newBasketData;
          this.summ = 0;
          this.count = 0;
        }
      }
    );
    const customer = JSON.parse(localStorage.getItem('curentUser') as string);

    this.favoritesService.favorites$.subscribe((favorites) => {
      this.favoriteProducts = favorites;
      this.favoritGoods = this.favoriteProducts.length;
      console.log(this.favoritGoods);
    });
  }

  // Отримати меню зі служби меню
  getMenu() {
    this.menuService.getAll().subscribe((data) => {
      this.menuArr = data as MenuResponse[];
      this.menuArr.sort((a, b) => a.menuindex - b.menuindex);
    });
  }

  // Відстежування події прокрутки вікна
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const headerWrapper =
      this.el.nativeElement.querySelector('.header-wrapper');
    const scrollPosition = window.scrollY;
    const windowWidth = window.innerWidth;

    if (windowWidth > 1240) {
      if (scrollPosition > 0) {
        headerWrapper.style.top = '-65px'; 
     
      } else {
        headerWrapper.style.top = '0px'; 
      }
    }
  }

  // Вибір пункту меню
  onSelectItem(item: string): void {
    this.menuLink = item;
    this.headerService.emitHeaderClick(item);
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  // Анімація активного стану гамбургера
 hamburger_active() {

    const headerTop = this.el.nativeElement.querySelector('.header-top');
    const headerMenuList = this.el.nativeElement.querySelector('.menu-list');
    const hamburgerInner =
      this.el.nativeElement.querySelector('.hamburger-inner');

    if (hamburgerInner) {
      headerTop.classList.toggle('active');
      headerMenuList.classList.toggle('active');
      hamburgerInner.classList.toggle('active');
    }
  }

  ngOnDestroy(): void {
    this.basketSubscription.unsubscribe();
  }

  updateBasketData(newBasketData: Array<GoodsResponse>): void {
    localStorage.setItem('basket', JSON.stringify(newBasketData));
  }

  addToBasket(): void {
    const basketData = localStorage.getItem('basket');
    if (basketData && basketData !== 'null') {
      this.basket = JSON.parse(basketData);
      this.summPrice();
      this.headerService.updateBasketData(this.basket);
    }
  }

  // Розрахунок загальної суми та бонусів
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
  }

  changeUserUrl() {
    const currentUserString = localStorage.getItem('curentUser');
    /*  console.log(currentUserString); */

    if (typeof currentUserString === 'string') {
      const courentUser = JSON.parse(currentUserString);

      if (courentUser && courentUser.role == ROLE.ADMIN) {
        this.isLogin = true;
        this.loginUrl = 'admin';
        this.fullName = `${courentUser.firstName} ${courentUser.lastName}`;
      } else if (courentUser && courentUser.role == ROLE.USER) {
        this.isLogin = true;
        this.loginUrl = 'user';
        this.fullName = `${courentUser.firstName} ${courentUser.lastName}`;
      } else {
        this.isLogin = false;
        this.loginUrl = ' ';
        this.fullName = '';
      }
    }
  }

  // Перезавантаження сторінки
  reload() {
    window.location.href = '/';
  }

  sighInModal(): void {
    let sighIn = this.dialog.open(SigninComponent, {
      panelClass: 'sigh_maoa_dialog',
    });
    console.log(sighIn);

    sighIn.afterClosed().subscribe(() => {
      this.changeUserUrl();
    });
  }

  activeMenu() {
    if (this.loginUrl === 'admin') {
      this.router.navigate(['admin']);
    } else {
      this.activeUserMenu = !this.activeUserMenu;
    }
  }
  closrUserMenu() {
    this.activeUserMenu = false;
  }

  logout() {
    this.router.navigate(['/']);
    localStorage.removeItem('curentUser');
    window.location.href = '/';
  }

  basketOpen() {
    let basket = this.dialog.open(BasketComponent, {
      data: { panelClass: 'active' },
    });
  }
}
