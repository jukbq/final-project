import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdditionalProductsComponent } from './admin-additional-products.component';

describe('AdminAdditionalProductsComponent', () => {
  let component: AdminAdditionalProductsComponent;
  let fixture: ComponentFixture<AdminAdditionalProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAdditionalProductsComponent]
    });
    fixture = TestBed.createComponent(AdminAdditionalProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
