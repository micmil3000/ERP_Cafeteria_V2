import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-page-header',
  styleUrl: './page-header.component.css',
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  title = input.required<string>();
  description = input.required<string>();
}
