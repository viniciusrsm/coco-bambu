import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  Observable,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Book } from '../book';
import { BookDialog } from '../book-dialog/book-dialog.component';
import { BookFetchService } from '../book-fetch.service';
import { SavedBooksService } from '../saved-books.service';

export interface DialogData {
  id: string;
  title: string;
  author: string[] | null;
  desc: string | null;
  cover: string | null;
  comment: string | null;
  rate: string | null;
  tag: string | null;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent implements OnInit {
  searchControl = new FormControl('');
  typeControl = new FormControl('title');
  filteredBooks: Observable<Book[]> | undefined;
  books: { [key: string]: string[] } = {};

  private booksReadySubject = new BehaviorSubject<boolean>(false);

  dialog = inject(MatDialog);
  bookFetchService: BookFetchService = inject(BookFetchService);
  savedBooksService: SavedBooksService = inject(SavedBooksService);
  booksReady$ = this.booksReadySubject.asObservable();

  constructor() {}

  ngOnInit(): void {
    this.filteredBooks = this.searchControl.valueChanges.pipe(
      startWith(''),
      tap(() => {
        this.books = {};
        this.booksReadySubject.next(false);
      }),
      switchMap((value) => {
        return value
          ? this.bookFetchService
              .getAllBooks(value, this.typeControl.getRawValue()!)
              .pipe(
                map((response) => {
                  return response.items.slice(0, 4).map((book: any) => {
                    let id: string = book.id;
                    let title: string = book.volumeInfo.title;
                    let authors: string = book.volumeInfo?.authors || '';
                    let desc: string = book.volumeInfo?.description || '';
                    let cover: string =
                      book.volumeInfo.imageLinks?.thumbnail || '';

                    this.books[title] = [id, authors, desc, cover];
                    return {
                      id: id,
                      title: title,
                      authors: authors,
                      desc: desc,
                      cover: cover,
                    };
                  });
                }),
                tap(() => {
                  this.booksReadySubject.next(true);
                }),
                catchError((err) => {
                  console.error(err);
                  return '';
                })
              )
          : '';
      })
    );
  }

  openDialog(title: string): void {
    this.typeControl.setValue('title');
    this.searchControl.setValue(this.searchControl.value);

    this.booksReady$
      .pipe(
        filter((ready) => {
          return ready;
        }),
        take(1),
        tap(() => {
          if (this.books[title]) {
            this.dialog.open(BookDialog, {
              data: {
                id: this.books[title][0],
                author: this.books[title][1],
                title: title,
                desc: this.books[title][2],
                cover: this.books[title][3],
              },
            });
          }
        })
      )
      .subscribe();
  }
}
