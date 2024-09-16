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
  author: string;
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
  template: `
    <form class="example-form">
      <mat-form-field class="example-full-width">
        <input
          type="text"
          placeholder="Pesquisar livro"
          matInput
          [formControl]="myControl"
          [matAutocomplete]="auto"
        />
        <mat-autocomplete
          #auto="matAutocomplete"
          (optionSelected)="openDialog($event.option.value)"
        >
          @for (book of filteredBooks | async; track book.id) {
          <mat-option [value]="book.title">{{ book.title }}</mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
    </form>
  `,
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
                  this.booksReadySubject.next(true);
                  return {
                    id: id,
                    title: title,
                    authors: authors,
                    desc: desc,
                    cover: cover,
                  };
                })
              ),
              tap((res) => {
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
    this.booksReady$
      .pipe(
        filter((ready) => {
          return ready;
        }),
        take(1),
        tap(() => {
          console.log(this.books);
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
