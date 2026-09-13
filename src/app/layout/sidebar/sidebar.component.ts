import { Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	imports: [RouterLink, RouterLinkActive],
	selector: 'app-sidebar',
	styleUrl: './sidebar.component.css',
	templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
	readonly closeSidebar = output<void>();
	//Rol actual del usuario. Para pruebas.
	protected readonly currentRole: 'GERENTE' | 'TRABAJADOR' = 'GERENTE';

	//Todas las opciones de navegación disponibles en la aplicación. Incluye label, ruta a donde te lleva y el icono que aparece. 
	protected readonly navigation = [
		{
			label: 'Inicio',
			route: '/inicio',
			icon: 'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z'
		},
		{
			label: 'Finanzas',
			route: '/finanzas',
			icon: 'M3 3v18h18 M7 14l4-4 4 2 6-7 M16 5h5v5'
		},
		{
			label: 'Inventario',
			route: '/inventario',
			icon: 'm12 3 9 5v8l-9 5-9-5V8Z M3 8l9 5 9-5 M12 13v8 M7.5 5.5l9 5'
		},
		{
			label: 'Ventas',
			route: '/ventas',
			icon: 'M2 3h3l3 13h11l3-9H6 M10 21h.01 M18 21h.01'
		},
		{
			label: 'Compras y Proveedores',
			route: '/compras',
			icon: 'M1 4h13v13H1Z M14 8h4l4 5v4h-8 M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0'
		},
		{
			label: 'Recursos Humanos',
			route: '/recursos-humanos',
			icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M17 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87'
		},
	];

	//Devuelve el label del rol actual del usuario.
	protected get roleLabel(): string {
		return this.currentRole === 'GERENTE' ? 'Gerente' : 'Trabajador';
	}

	//Filtra las opciones de navegación según el rol del usuario. Gerente = todos, Trabajador = sin Finanzas ni Compras y Proveedores.
	protected get visibleNavigation() {
		return this.currentRole === 'GERENTE'
			? this.navigation
			: this.navigation.filter(
				(item) =>
					item.label !== 'Finanzas' &&
					item.label !== 'Compras y Proveedores'
			);
	}
}