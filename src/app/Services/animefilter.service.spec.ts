import { TestBed } from '@angular/core/testing';

import { AnimefilterService } from './animefilter.service';

describe('AnimefilterService', () => {
  let service: AnimefilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimefilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
