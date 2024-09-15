import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { BookFetchService } from '../book-fetch.service';

export interface DialogData {
  title: string;
  author: string;
  desc: string;
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
          @for (option of filteredOptions | async; track option) {
          <mat-option [value]="option">{{ option }}</mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
    </form>
  `,
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent implements OnInit {
  myControl = new FormControl('');
  filteredOptions: Observable<string[]> | undefined;
  books: { [key: string]: string[] } = {};

  dialog = inject(MatDialog);

  bookFetchService: BookFetchService = inject(BookFetchService);

  constructor() {}

  ngOnInit(): void {
    this.myControl.updateOn;

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      switchMap((value) =>
        this.myControl.value
          ? this.bookFetchService.getAllBooks(value!).pipe(
              map((response) =>
                response.items.slice(0, 4).map((book: any) => {
                  this.books[book.volumeInfo.title] = [
                    book.id,
                    book.volumeInfo.authors,
                    book.volumeInfo.description,
                  ];
                  return book.volumeInfo.title;
                })
              )
            )
          : ''
      )
    );
  }

  openDialog(title: string): void {
    console.log(this.books[title]);
    const dialogRef = this.dialog.open(BookDialog, {
      data: { title: title },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'book-dialog',
  template: `<h2 mat-dialog-title>{{ data.title }}</h2>`,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class BookDialog {
  readonly dialogRef = inject(MatDialogRef<BookDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
