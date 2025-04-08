import { TestBed } from '@angular/core/testing';

import { MoviefilterService } from './moviefilter.service';

describe('MoviefilterService', () => {
  let service: MoviefilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoviefilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
