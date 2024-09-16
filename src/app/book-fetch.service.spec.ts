import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { BookFetchService } from './book-fetch.service';

describe('BookFetchService', () => {
  let service: BookFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(BookFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
