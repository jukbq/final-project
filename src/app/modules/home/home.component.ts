import { Component } from '@angular/core';
import { ActionResponse } from 'src/app/shared/interfaces/action';
import { ActionService } from 'src/app/shared/services/action/action.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private actionService: ActionService) {}

  public slides: Array<ActionResponse> = [];

  ngOnInit(): void {
    this.getActions();
  }

  getActions(): void {
    this.actionService.getAll().subscribe((data) => {
      this.slides = data;
    });
  }

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    fade: true, // Застосування ефекту зникання
    autoplay: false,
    autoplaySpeed: 3000, // Затримка між автоматичними переходами в мілісекундах
    dots: true,
    arrows: true,
    swipe: true,
  };

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

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
}
