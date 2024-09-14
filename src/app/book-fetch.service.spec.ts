import { TestBed } from '@angular/core/testing';

import { BookFetchService } from './book-fetch.service';

describe('BookFetchService', () => {
  let service: BookFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
