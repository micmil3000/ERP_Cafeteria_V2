import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-stat-card',
  styleUrl: './stat-card.component.css',
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {
  label = input.required<string>();
  value = input.required<string | number>();
  detail = input.required<string>();
}
