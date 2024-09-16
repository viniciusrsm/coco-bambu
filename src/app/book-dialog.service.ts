import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookDialog } from './book-dialog/book-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class BookDialogService {
  dialog = inject(MatDialog);

  constructor() {}

  openEditDialog() {
    const dialogRef = this.dialog.open(BookDialog, {});
  }
}
