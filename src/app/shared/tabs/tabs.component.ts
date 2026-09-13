import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-tabs',
  styleUrl: './tabs.component.css',
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  // Define lo que el componente va a recibir como input, en este caso las pestañas y la pestaña activa
  tabs = input.required<readonly { id: string; label: string }[]>();
  activeTab = input.required<string>();
  
  // Define un output para emitir un evento cuando se cambie de pestaña
  @Output() readonly tabChange = new EventEmitter<string>();
}
