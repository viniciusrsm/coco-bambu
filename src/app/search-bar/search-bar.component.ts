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

export interface DialogData {
  id: string;
  title: string;
  authors: string;
  desc: string;
  cover: string;
  comment: string;
  rate: string;
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
  myControl = new FormControl('');
  filteredBooks: Observable<Book[]> | undefined;
  books: { [key: string]: string[] } = {};

  private booksReadySubject = new BehaviorSubject<boolean>(false);
  booksReady$ = this.booksReadySubject.asObservable();

  dialog = inject(MatDialog);
  bookFetchService: BookFetchService = inject(BookFetchService);

  constructor() {}

  ngOnInit(): void {
    this.filteredBooks = this.myControl.valueChanges.pipe(
      startWith(''),
      tap(() => {
        this.books = {};
        this.booksReadySubject.next(false);
      }),
      switchMap((value) => {
        return value
          ? this.bookFetchService.getAllBooks(value).pipe(
              map((response) =>
                response.items.slice(0, 4).map((book: any) => {
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
                })
              ),
              tap(() => {
                this.booksReadySubject.next(true);
              }),
              catchError((err) => {
                return '';
              })
            )
          : '';
      })
    );
  }

  openDialog(title: string): void {
    this.booksReady$
      .pipe(
        filter((ready) => {
          return ready;
        }),
        take(1),
        tap(() => {
          const dialogRef = this.dialog.open(BookDialog, {
            data: {
              id: this.books[title][0],
              authors: this.books[title][1],
              title: title,
              desc: this.books[title][2],
              cover: this.books[title][3],
            },
          });

          dialogRef.afterClosed().subscribe((result) => {
            this.booksReadySubject.next(false);
          });
        })
      )
      .subscribe();
  }
}
