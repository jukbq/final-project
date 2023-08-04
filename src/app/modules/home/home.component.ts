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
      console.log(this.slides);
    });
  }

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    fade: true, // Застосування ефекту зникання
    autoplay: true,
    autoplaySpeed: 3000, // Затримка між автоматичними переходами в мілісекундах
    dots: true,
    arrows: true,
    swipe: true,
  };

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(event: any) {
    console.log('Slick carousel initialized:', event);
  }

  breakpoint(event: any) {
    console.log('Breakpoint reached:', event);
    if (event.currentBreakpoint === 'xs') {
      this.slideConfig.slidesToShow = 1;
    } else {
      this.slideConfig.slidesToShow = 4;
    }
  }

  afterChange(event: any) {
    console.log('Slide changed:', event);
  }

  beforeChange(event: any) {
    console.log('Before slide change:', event);
  }
}
