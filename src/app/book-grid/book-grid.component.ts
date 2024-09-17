import { NgFor, NgStyle } from '@angular/common';
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
  imports: [MatGridListModule, BookComponent, NgFor, BookDialog, NgStyle],
  templateUrl: './book-grid.component.html',
})
export class BookGridComponent {
  bookInfoList: Book[] = [];
  bookFetchService: BookFetchService = inject(BookFetchService);
  savedBooksService: SavedBooksService = inject(SavedBooksService);
  dialog = inject(MatDialog);
  cols: number = 6;
  gridWidth: string = '1200px';

  constructor() {}

  changeCols(e: any): void {
    //console.log(this.gridWidth);
    const wid: number = e.target.innerWidth;
    if (wid <= 500) this.cols = 1;
    else if (wid <= 600) this.cols = 2;
    else if (wid <= 810) this.cols = 3;
    else if (wid <= 1050) this.cols = 4;
    else if (wid <= 1280) this.cols = 5;
    else this.cols = 6;
    this.gridWidth != `${200 * this.cols}px` &&
      (this.gridWidth = `${200 * this.cols}px`);
    //this.cols = e.target.innerWidth <= 400 ? 1 : 6;
  }

  openBook(bookInfo: any): void {
    const dialogRef = this.dialog.open(BookDialog, {
      data: {
        id: bookInfo['id'],
        author: bookInfo['author'],
        title: bookInfo['title'],
        desc: bookInfo['desc'],
        cover: bookInfo['cover'],
        rate: bookInfo['rate'],
        comment: bookInfo['comment'],
      },
    });
  }
}
