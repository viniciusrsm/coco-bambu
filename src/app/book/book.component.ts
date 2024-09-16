import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { Book } from '../book';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [MatGridListModule, FormsModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent implements OnInit {
  @Input() bookInfo!: Book;
  stars: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.stars = this.bookInfo
      ? Array(5)
          .fill(0)
          .map((x, i) => {
            return Number(this.bookInfo.rate) > i ? 1 : 0;
          })
      : Array(5).fill(0);
  }
}
