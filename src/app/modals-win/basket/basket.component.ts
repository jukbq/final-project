import { Component, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
})
export class BasketComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}
  ngOnInit(): void {
   const cartElement = this.el.nativeElement.querySelector('.cart');
   console.log(cartElement);
   
   if (cartElement && this.data.panelClass) {
    console.log(this.data.panelClass);
    
     this.renderer.addClass(cartElement, this.data.panelClass);
   }
  }
}
