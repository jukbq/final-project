import { TestBed } from '@angular/core/testing';

import { DilogService } from './dilog.service';

describe('DilogService', () => {
  let service: DilogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DilogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
