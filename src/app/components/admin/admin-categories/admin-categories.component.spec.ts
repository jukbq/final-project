import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoriesComponent } from './admin-categories.component';
import { of } from 'rxjs';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { CategoriesService } from 'src/app/shared/services/categories/categories.service';
import { Firestore } from '@angular/fire/firestore';
import { ApCategoryService } from 'src/app/shared/services/apCategory/ap-category.service';

describe('AdminCategoriesComponent', () => {
  let component: AdminCategoriesComponent;
  let fixture: ComponentFixture<AdminCategoriesComponent>;

  const menuServiceMock = {
    getAll: (id: number | string) => of([{
      menuindex: id,
      menuName: '',
      menuLink: '',
      menuImages: ''
    }])
  };

  const categoriesServiceMock = {
    getAllCategories: (id: number | string) => of([{
      menu: '',
      menuName: '',
      menuLink: '',
      titel: '',
      link: '',
      images: ''
    }])
  };

  const apCategoryServiceMock = {
    getAllCategories: (id: number | string) => of([{
      category: '',
      link: '',
    }])
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCategoriesComponent],
      providers: [
        { provide: MenuService, useValue: menuServiceMock },
        { provide: CategoriesService, useValue: categoriesServiceMock },
        { provide: ApCategoryService, useValue: apCategoryServiceMock },
        { provide: Storage, useValue: {} }

      ],


    });
    fixture = TestBed.createComponent(AdminCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
