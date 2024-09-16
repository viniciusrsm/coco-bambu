import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { Book } from '../book';
import { BookDialogService } from '../book-dialog.service';
import { BookDialog } from '../book-dialog/book-dialog.component';
import { BookFetchService } from '../book-fetch.service';
import { BookComponent } from '../book/book.component';
import { SavedBooksService } from '../saved-books.service';

@Component({
  selector: 'app-book-grid',
  standalone: true,
  imports: [MatGridListModule, BookComponent, NgFor, BookDialog],
  templateUrl: './book-grid.component.html',
  styleUrl: './book-grid.component.css',
})
export class BookGridComponent {
  bookInfoList: Book[] = [];
  bookFetchService: BookFetchService = inject(BookFetchService);
  books: { [id: string]: any } = {};
  savedBooksService: SavedBooksService = inject(SavedBooksService);
  bookDialogService: BookDialogService = inject(BookDialogService);
  dialog = inject(MatDialog);

  constructor() {
    console.log(this.savedBooksService.savedBooks);

    this.bookFetchService.getAllBooks('').subscribe((res) => {
      this.books = res.items.map((book: any) => book.volumeInfo);
      //console.log(this.books);
    });

    //this.bookInfoList = this.bookFetchService.getAllBooks();
  }

  teste(bookInfo: any): void {
    //this.bookDialogService.openEditDialog();
    console.log(bookInfo);

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
