import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
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
    private menuService: MenuService
  ) {}

  public menuAr: Array<MenuResponse> = [];
  public menuName!: string;

  ngOnInit(): void {
    this.getMenu();
  }

  getMenu() {
    this.menuService.getAll().subscribe((data) => {
      this.menuAr = data as MenuResponse[];
      this.menuAr.sort((a, b) => a.menuindex - b.menuindex);
      console.log(this.menuAr);
    });
  }

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
  handleHeaderClick() {
    this.headerService.emitHeaderClick();
  }

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
  reload() {
    window.location.href = '/';
  }
}
