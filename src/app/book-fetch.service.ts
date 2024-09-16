import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookFetchService {
  constructor(private http: HttpClient) {}

  getAllBooks(title: string): Observable<any> {
    return this.http.get(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}`
    );
  }

  /* getBookById(id: number): Book | undefined {
    return this.bookInfoList.find((book) => book.id === id);
  } */
}
