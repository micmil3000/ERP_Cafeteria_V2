import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-tabs',
  styleUrl: './tabs.component.css',
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  tabs = input.required<readonly { id: string; label: string }[]>();
  activeTab = input.required<string>();
  
  @Output() readonly tabChange = new EventEmitter<string>();
}
