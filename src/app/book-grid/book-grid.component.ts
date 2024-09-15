import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Book } from '../book';
import { BookFetchService } from '../book-fetch.service';
import { BookComponent } from '../book/book.component';

@Component({
  selector: 'app-book-grid',
  standalone: true,
  imports: [MatGridListModule, BookComponent, NgFor],
  templateUrl: './book-grid.component.html',
  styleUrl: './book-grid.component.css',
})
export class BookGridComponent {
  bookInfoList: Book[] = [];
  bookFetchService: BookFetchService = inject(BookFetchService);
  books: { [id: string]: any } = {};

  constructor() {
    this.bookFetchService.getAllBooks('s').subscribe((res) => {
      this.books = res.items.map((book: any) => book.volumeInfo);
      //console.log(this.books);
    });

    //this.bookInfoList = this.bookFetchService.getAllBooks();
  }
}
