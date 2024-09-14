import { Component, Input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Book } from '../book';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [MatGridListModule],
  //templateUrl: './book.component.html',
  template: `
      <div style="display: flex; flex-direction: column; height: 85%;">
        <p style="margin-bottom: auto;">{{bookInfo.name}}</p>
        <img />
        <p>estrelas</p>
      </div>
  `,
  styleUrl: './book.component.css'
})
export class BookComponent {
  @Input() bookInfo!: Book;
}
