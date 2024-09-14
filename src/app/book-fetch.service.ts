import { Injectable } from '@angular/core';
import { Book } from './book';

@Injectable({
  providedIn: 'root'
})
export class BookFetchService {

  constructor() { }

  protected bookInfoList: Book[] = [
    {
      id: 1,
      name: "teste 1",
      author: "teste 2",
      img: "a",
      desc: "abcd",
    },
    {
      id: 2,
      name: "teste 2",
      author: "teste 2",
      img: "a",
      desc: "abcd",
    },
    {
      id: 3,
      name: "teste 3",
      author: "teste 2",
      img: "a",
      desc: "abcd",
    }
  ];

  getAllBooks(): Book[] {
    return this.bookInfoList;
  }

  getBookById(id: number): Book | undefined {
    return this.bookInfoList.find((book) => book.id === id);
  } 
}
