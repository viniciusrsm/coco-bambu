import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
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
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';
import { Book } from '../book';
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
    MatAutocompleteModule,
    AsyncPipe,
    NgStyle,
    NgIf,
  ],
})
export class BookDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<BookDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  dialogForm: FormGroup;
  filteredTags: Observable<string[]> | undefined;
  tagErrorMsg: string = '';

  savedBooksService: SavedBooksService = inject(SavedBooksService);

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {
    this.dialogForm = this.formBuilder.group({
      id: [this.data.id],
      title: [this.data.title],
      author: [this.data.author],
      cover: [this.data.cover],
      desc: [this.data.desc],
      comment: [this.data.comment] || [''],
      rate: [this.data.rate] || [''],
      tag: this.data.tag ? [this.data.tag!] : [''],
    });
  }

  ngOnInit() {
    //const tagValue: FormControl<string | null> = this.dialogForm.controls['tag'];
    this.filteredTags = this.dialogForm.controls['tag'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filter(value || '');
      })
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.savedBooksService.tags.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  editOrPush(newValues: Book): void {
    let dupIndex = this.savedBooksService.savedBooks.findIndex(
      (savedBook) => savedBook.id === this.data.id
    );

    dupIndex != -1
      ? (this.savedBooksService.savedBooks[dupIndex] = newValues)
      : this.savedBooksService.savedBooks.push(newValues);
  }

  onSubmit() {
    if (
      !this.savedBooksService.tags.includes(this.dialogForm.value['tag']) &&
      this.dialogForm.value['tag'] != ''
    ) {
      this.tagErrorMsg = 'Esta tag não existe.';
    } else if (this.dialogForm.valid) {
      const formData = this.dialogForm.value;

      this.editOrPush(formData);
      this.savedBooksService.changeDisplay(null);

      this.dialogRef.close();

      this.dialogForm.reset();
    } else {
      console.error('Formulário inválido');
    }
  }

  handleTag(): void {
    let currTag = this.dialogForm.value['tag'];
    if (currTag) {
      const tagExists = this.savedBooksService.tags.findIndex(
        (tag) => tag === currTag
      );
      if (tagExists == -1) this.savedBooksService.tags.push(currTag);
      else this.tagErrorMsg = 'Esta tag já existe';
    }
  }
}
