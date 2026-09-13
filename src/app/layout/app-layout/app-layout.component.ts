import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AppHeaderComponent } from '../app-header/app-header.component';

@Component({
	imports: [
		RouterOutlet,
		SidebarComponent,
		AppHeaderComponent
	],
	selector: 'app-app-layout',
	styleUrl: './app-layout.component.css',
	templateUrl: './app-layout.component.html',
})
export class AppLayoutComponent {
	//Indica si el sidebar está abierto o cerrado
	protected sidebarOpen = true;

	//Método para cerrar el sidebar
	protected closeSidebar(): void {
		this.sidebarOpen = false;
	}

	//Método para abrir el sidebar
	protected openSidebar(): void {
		this.sidebarOpen = true;
	}
}