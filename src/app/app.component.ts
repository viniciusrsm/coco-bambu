import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookGridComponent } from './book-grid/book-grid.component';
import { HomeComponent } from './home/home.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, SearchBarComponent, BookGridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'coco-bambu';
}
