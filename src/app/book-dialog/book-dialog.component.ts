import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SavedBooksService } from '../saved-books.service';
import { DialogData } from '../search-bar/search-bar.component';

@Component({
  selector: 'book-dialog',
  templateUrl: './book-dialog.component.html',
  standalone: true,
  styleUrl: './book-dialog.component.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
  ],
})
export class BookDialog {
  readonly dialogRef = inject(MatDialogRef<BookDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  myForm: FormGroup;

  savedBooksService: SavedBooksService = inject(SavedBooksService);

  constructor(private formBuilder: FormBuilder) {
    console.log(this.data.comment);
    console.log(this.data.rate);
    // Inicializa o formulário com FormBuilder
    this.myForm = this.formBuilder.group({
      id: [this.data.id],
      title: [this.data.title],
      authors: [this.data.authors],
      cover: [this.data.cover],
      desc: [this.data.desc],
      comment: [this.data.comment] || ['', Validators.required], // Campo 'name' com validação
      rate: [this.data.rate] || ['', Validators.required], // Campo 'age' com validação
    });
  }

  editOrPush(newValues: any): void {
    console.log(this.data.id);
    let dupIndex = this.savedBooksService.savedBooks.findIndex(
      (savedBook) => savedBook.id === this.data.id
    );

    dupIndex != -1
      ? (this.savedBooksService.savedBooks[dupIndex] = newValues)
      : this.savedBooksService.savedBooks.push(newValues);
  }

  onSubmit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;

      this.editOrPush(formData);

      this.dialogRef.close();

      this.myForm.reset();
    } else {
      console.log('Formulário inválido');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    console.log(this.savedBooksService.savedBooks);
    this.dialogRef.close();
  }
}
