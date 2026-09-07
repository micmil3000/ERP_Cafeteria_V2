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
	protected sidebarOpen = true;

	protected closeSidebar(): void {
		this.sidebarOpen = false;
	}

	protected openSidebar(): void {
		this.sidebarOpen = true;
	}
}