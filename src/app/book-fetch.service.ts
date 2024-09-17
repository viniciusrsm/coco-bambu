import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookFetchService {
  constructor(private http: HttpClient) {}

  getAllBooks(search: string, type: string): Observable<any> {
    console.log(type);
    console.log(search);
    return type === 'title'
      ? this.http.get(
          `https://www.googleapis.com/books/v1/volumes?q=intitle:${search}`
        )
      : this.http.get(
          `https://www.googleapis.com/books/v1/volumes?q=inauthor:${search}`
        );
  }
}
