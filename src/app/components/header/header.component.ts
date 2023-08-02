import {Component, ElementRef, HostListener} from '@angular/core';
import {Router} from "@angular/router";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private el: ElementRef, private router: Router) {}

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const header = this.el.nativeElement.querySelector('header');
    const headerTop = this.el.nativeElement.querySelector('.header-top');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 0) {
      // Якщо сторінку прокручено вниз, приховати header-top
      headerTop.style.transform = 'translateY(-100%)';
      header.style.transition = 'transform 0.3s ease';
      header.style.transform = 'translateY(-100%)';
    } else {
      // Якщо сторінку прокручено вгору, показати header-top
      headerTop.style.transform = 'none';
      header.style.transition = 'none';
      header.style.transform = 'none';
    }
  }

  public hamburger_active() {
     const headerTop = this.el.nativeElement.querySelector('.header-top');
     const headerMenuList = this.el.nativeElement.querySelector('.menu-list');
     const hamburgerInner = this.el.nativeElement.querySelector('.hamburger-inner');
 
    if (hamburgerInner) {
      headerTop.classList.toggle('active');
      headerMenuList.classList.toggle('active');
      hamburgerInner.classList.toggle('active');
    }
  }
}
