import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGoodsComponent } from './admin-goods.component';

describe('AdminGoodsComponent', () => {
  let component: AdminGoodsComponent;
  let fixture: ComponentFixture<AdminGoodsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminGoodsComponent]
    });
    fixture = TestBed.createComponent(AdminGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
