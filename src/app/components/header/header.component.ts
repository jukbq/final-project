import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private el: ElementRef, private router: Router) {}

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
}
