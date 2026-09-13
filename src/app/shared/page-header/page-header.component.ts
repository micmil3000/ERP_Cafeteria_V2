import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-page-header',
  styleUrl: './page-header.component.css',
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  //Define lo que el componente va a recibir como input, en este caso un titulo y una descripcion
  title = input.required<string>();
  description = input.required<string>();
}
