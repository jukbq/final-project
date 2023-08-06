import { TestBed } from '@angular/core/testing';

import { ApCategoryService } from './ap-category.service';

describe('ApCategoryService', () => {
  let service: ApCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
