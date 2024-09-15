import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from './book';

@Injectable({
  providedIn: 'root',
})
export class BookFetchService {
  constructor(private http: HttpClient) {}

  protected bookInfoList: Book[] = [
    {
      id: 1,
      name: 'teste 1',
      author: 'teste 2',
      img: 'a',
      desc: 'abcd',
    },
    {
      id: 2,
      name: 'teste 2',
      author: 'teste 2',
      img: 'a',
      desc: 'abcd',
    },
    {
      id: 3,
      name: 'teste 3',
      author: 'teste 2',
      img: 'a',
      desc: 'abcd',
    },
  ];

  getAllBooks(title: string): Observable<any> {
    return this.http.get(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}`
    );
  }

  getBookById(id: number): Book | undefined {
    return this.bookInfoList.find((book) => book.id === id);
  }
}
