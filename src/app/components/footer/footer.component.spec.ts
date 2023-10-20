import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { MenuService } from 'src/app/shared/services/menu/menu.service';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderService } from 'src/app/shared/services/header/header.service';
import { ViewportScroller } from '@angular/common';
import { By } from '@angular/platform-browser';

const LIST: any[] = [
  { name: 'Про нас', link: 'about-us' },
  { name: 'Доставка та оплата', link: 'delivery-and-payment' },
  { name: 'Акції', link: 'actions' },
  { name: 'Контакти', link: 'contacts' },
  { name: 'Вакансії', link: 'vacancies' },
  { name: 'Новини', link: 'news' },
];

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  const menuServiceMock = {
    getAll: (id: number | string) => of([{
      menuindex: id,
      menuName: '',
      menuLink: '',
      menuImages: ''
    }])
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      providers: [{ provide: MenuService, useValue: menuServiceMock }],
      imports: [
        RouterTestingModule
      ]
    });

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Тест ініціалізації компоненти
  it('should initialize component properties', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    const component = fixture.componentInstance;
    expect(component.menuArr).toEqual([]);
    expect(component.list).toEqual(LIST);
  });

  //Тест методу getMenu()
  it('should fetch and process menu data', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    const component = fixture.componentInstance;
    component.getMenu();
  });

  //Тест методу onSelectItem(item: string)
  it('should emit header click event and scroll to top', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    const component = fixture.componentInstance;

    const headerService = TestBed.inject(HeaderService);
    const emitHeaderClickSpy = spyOn(headerService, 'emitHeaderClick');

    const viewportScroller = TestBed.inject(ViewportScroller);
    const scrollToPositionSpy = spyOn(viewportScroller, 'scrollToPosition');

    const item = 'example-item';
    component.onSelectItem(item);

    expect(emitHeaderClickSpy).toHaveBeenCalledWith(item);
    expect(scrollToPositionSpy).toHaveBeenCalledWith([0, 0]);
  });

  //Тест шаблону
  it('should have routerLink in the first list item', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const firstListItem = fixture.debugElement.query(By.css('.footer-menu-list .menu-item:first-child'));
    const routerLinkAttribute = firstListItem.nativeElement.getAttribute('routerLink');

    expect(routerLinkAttribute).toBeDefined();
  });








});
