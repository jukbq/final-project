import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalProductsComponent } from './additional-products.component';

describe('AdditionalProductsComponent', () => {
  let component: AdditionalProductsComponent;
  let fixture: ComponentFixture<AdditionalProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalProductsComponent]
    });
    fixture = TestBed.createComponent(AdditionalProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
