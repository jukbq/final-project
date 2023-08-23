import { Component, ElementRef, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SigninComponent } from 'src/app/modals-win/signin/signin.component';
import { ROLE } from 'src/app/shared/guards/role.constant';
import { MenuResponse } from 'src/app/shared/interfaces/menu';
import { HeaderService } from 'src/app/shared/services/header/header.service';
import { MenuService } from 'src/app/shared/services/menu/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    private el: ElementRef,
    private router: Router,
    private headerService: HeaderService,
    private menuService: MenuService,
    public dialog: MatDialog
  ) {}

  public menuArr: Array<MenuResponse> = [];
  public menuLink = 'pizza';
  public isLogin = false;
  public loginUrl = '';
  public activeUserMenu = false;
  public fullName = '';

  ngOnInit(): void {
    this.changeUserUrl();
    this.getMenu();
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
        headerWrapper.style.top = '-65px'; // Зміна позиції верху шапки при прокрутці
      } else {
        headerWrapper.style.top = '0px'; // Повернення шапки на початкову позицію
      }
    }
  }

  // Вибір пункту меню
  onSelectItem(item: string): void {
    this.menuLink = item;
  }

  // Обробник кліку на пункт меню в хедері
  handleHeaderClick(item: any) {
    this.headerService.emitHeaderClick(item); // Відправити подію в сервіс
  }

  // Анімація активного стану гамбургера
  public hamburger_active() {
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

  changeUserUrl() {
    const currentUserString = localStorage.getItem('curentUser');
    console.log(currentUserString);

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

    sighIn.afterClosed().subscribe(() => {
      this.changeUserUrl();
    });
  }

  activeMenu() {
    this.activeUserMenu = !this.activeUserMenu;
  }

  logout() {
    this.router.navigate(['/']);
    localStorage.removeItem('curentUser');
     window.location.href = '/';
  }
}
