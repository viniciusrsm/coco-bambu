import { AsyncPipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith, tap } from 'rxjs';
import { BookDialog } from '../book-dialog/book-dialog.component';
import { BookFetchService } from '../book-fetch.service';
import { BookComponent } from '../book/book.component';
import { SavedBooksService } from '../saved-books.service';

@Component({
  selector: 'app-book-grid',
  standalone: true,
  imports: [
    MatGridListModule,
    BookComponent,
    NgFor,
    BookDialog,
    NgStyle,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatInputModule,
    NgIf,
  ],
  templateUrl: './book-grid.component.html',
})
export class BookGridComponent implements OnInit {
  bookFetchService: BookFetchService = inject(BookFetchService);
  savedBooksService: SavedBooksService = inject(SavedBooksService);
  dialog = inject(MatDialog);
  cols: number = 6;
  gridWidth: string = '1200px';
  filterControl = new FormControl<string>('');
  filteredTags: Observable<string[]> | undefined;

  constructor() {}

  ngOnInit() {
    this.filteredTags = this.filterControl.valueChanges.pipe(
      startWith(''),
      map((tag) => {
        return this._filter(tag || '');
      }),
      tap((tags) => this.savedBooksService.changeDisplay(tags))
    );
  }

  private _filter(tag: string): string[] {
    const filterTag = tag.toLowerCase();

    return this.savedBooksService.tags.filter((option) => {
      return option.toLowerCase().includes(filterTag);
    });
  }

  changeCols(e: any): void {
    const wid: number = e.target.innerWidth;
    if (wid <= 500) this.cols = 1;
    else if (wid <= 600) this.cols = 2;
    else if (wid <= 810) this.cols = 3;
    else if (wid <= 1050) this.cols = 4;
    else if (wid <= 1280) this.cols = 5;
    else this.cols = 6;
    this.gridWidth != `${200 * this.cols}px` &&
      (this.gridWidth = `${200 * this.cols}px`);
  }

  openBook(bookInfo: any): void {
    this.dialog.open(BookDialog, {
      data: {
        id: bookInfo['id'],
        author: bookInfo['author'],
        title: bookInfo['title'],
        desc: bookInfo['desc'],
        cover: bookInfo['cover'],
        rate: bookInfo['rate'],
        comment: bookInfo['comment'],
        tag: bookInfo['tag'],
      },
    });
  }
}
