import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-badge',
  styleUrl: './badge.component.css',
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  text = input.required<string>();
  variant = input<'success' | 'warning' | 'danger' | 'neutral' | 'info'>('neutral');
}
