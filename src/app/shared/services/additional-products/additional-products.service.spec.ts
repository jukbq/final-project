import { TestBed } from '@angular/core/testing';

import { AdditionalProductsService } from './additional-products.service';

describe('AdditionalProductsService', () => {
  let service: AdditionalProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdditionalProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
