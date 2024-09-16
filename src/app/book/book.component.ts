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
  /* template: `
    <div
      style="display: flex; flex-direction: column; height: 100%; width: 100%;"
    >
      <p style="margin-bottom: auto;">{{ bookInfo.title }}</p>
      <img style="width: 128px; height: 184px;" src="{{ bookInfo.cover }}" />
      <p>{{ bookInfo.rate }} estrelas</p>
    </div>
  `, */
  styleUrl: './book.component.css',
})
export class BookComponent implements OnInit {
  @Input() bookInfo!: Book;
  stars: number[] = [];
  div: string = '<div>a</div>';
  div2: string = '<div>b</div>';

  constructor() {}

  ngOnInit(): void {
    console.log(this.bookInfo);

    this.stars = this.bookInfo
      ? Array(5)
          .fill(0)
          .map((x, i) => {
            console.log(x, i);
            return Number(this.bookInfo.rate) > i ? 1 : 0;
          })
      : Array(5).fill(0);
    console.log(this.stars);
  }
}
