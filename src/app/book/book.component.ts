import { Component, Input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Book } from '../book';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [MatGridListModule],
  /* templateUrl: './book.component.html', */
  template: `
    <div
      style="display: flex; flex-direction: column; height: 100%; width: 100%;"
    >
      <p style="margin-bottom: auto;">{{ bookInfo.title }}</p>
      <img style="width: 128px; height: 184px;" src="{{ bookInfo.cover }}" />
      <p>{{ bookInfo.rate }} estrelas</p>
    </div>
  `,
  styleUrl: './book.component.css',
})
export class BookComponent {
  @Input() bookInfo!: Book;
}
