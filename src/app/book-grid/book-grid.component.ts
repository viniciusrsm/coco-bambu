import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { Book } from '../book';
import { BookDialog } from '../book-dialog/book-dialog.component';
import { BookFetchService } from '../book-fetch.service';
import { BookComponent } from '../book/book.component';
import { SavedBooksService } from '../saved-books.service';

@Component({
  selector: 'app-book-grid',
  standalone: true,
  imports: [MatGridListModule, BookComponent, NgFor, BookDialog],
  templateUrl: './book-grid.component.html',
})
export class BookGridComponent {
  bookInfoList: Book[] = [];
  bookFetchService: BookFetchService = inject(BookFetchService);
  books: { [id: string]: any } = {};
  savedBooksService: SavedBooksService = inject(SavedBooksService);
  dialog = inject(MatDialog);

  constructor() {
    this.bookFetchService.getAllBooks('').subscribe((res) => {
      this.books = res.items.map((book: any) => book.volumeInfo);
    });
  }

  openBook(bookInfo: any): void {
    const dialogRef = this.dialog.open(BookDialog, {
      data: {
        id: bookInfo['id'],
        authors: bookInfo['author'],
        title: bookInfo['title'],
        desc: bookInfo['desc'],
        cover: bookInfo['cover'],
        rate: bookInfo['rate'],
        comment: bookInfo['comment'],
      },
    });
  }
}
