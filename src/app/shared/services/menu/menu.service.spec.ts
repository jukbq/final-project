import { TestBed } from '@angular/core/testing';
import { MenuService } from './menu.service';
import { of } from 'rxjs';

describe('MenuService', () => {
  let service: MenuService;

  const menuServiceMock = {
    collection: () => ({
      valueChanges: () => of([]),
    }),
  };;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: MenuService, useValue: menuServiceMock
      }]
    });
    service = TestBed.inject(MenuService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
