import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-badge',
  styleUrl: './badge.component.css',
  templateUrl: './badge.component.html',
})
export class BadgeComponent { //Componente reutilizable para mostrar badges de estados 
  //Información que recibe para mostrar en el badge dinámicamente
  text = input.required<string>();
  variant = input<'success' | 'warning' | 'danger' | 'neutral' | 'info'>('neutral');
}
