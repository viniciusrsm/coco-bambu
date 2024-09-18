import { Injectable } from '@angular/core';
import { Book } from './book';

@Injectable({
  providedIn: 'root',
})
export class SavedBooksService {
  constructor() {}
  displayedBooks: Book[] = [];

  savedBooks: Book[] = [];
  tags: string[] = [''];

  changeDisplay(displayTags: string[] | null) {
    this.displayedBooks = this.savedBooks.filter((book) => {
      return displayTags ? displayTags.includes(book.tag) : book;
    });
  }
}
