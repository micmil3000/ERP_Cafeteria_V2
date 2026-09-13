import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/stat-card/stat-card.component';

@Component({
  imports: [PageHeaderComponent, StatCardComponent, RouterLink],
  selector: 'app-dashboard-page',
  styleUrl: './dashboard-page.component.css',
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  //Variable para pruebas y cambiar roles
  protected readonly currentRole: 'GERENTE' | 'TRABAJADOR' = 'TRABAJADOR'; 

  // Datos ficticios utilizados únicamente para el maquetado.
  protected readonly workerStats = [
    { label: 'Mis ventas hoy', value: '$860.00', detail: '4 ventas realizadas', icon: 'M3 3h2l3 13h11l2-9H6 M10 20h.01 M18 20h.01' },
    { label: 'Mi asistencia', value: 'Presente', detail: 'Entrada: 8:02 a. m.', icon: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M7 12l3 3 7-7' },
    { label: 'Mi horario', value: '8:00 - 16:00', detail: 'Turno de hoy', icon: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 6v6l4 2' },
  ];

  protected readonly stats = [
    {
      label: 'Ventas hoy',
      value: '$2,840.00',
      detail: '12 ventas realizadas',
      icon: 'M3 3h2l3 13h11l2-9H6 M10 20h.01 M18 20h.01',
    },
    {
      label: 'Stock bajo',
      value: '4',
      detail: 'productos requieren atención',
      icon: 'm12 3 9 5v8l-9 5-9-5V8Z M3 8l9 5 9-5 M12 13v8 M7.5 5.5l9 5',
    },
    {
      label: 'Personal presente',
      value: '7',
      detail: 'de 8 trabajadores',
      icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M17 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87',
    },
  ];

  protected readonly alerts = [
    { text: '4 productos con stock bajo', icon: 'm12 3 9 5v8l-9 5-9-5V8Z M3 8l9 5 9-5 M12 13v8' },
    { text: '2 trabajadores registraron retardo hoy', icon: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 6v6l4 2' },
  ];

  //Acciones o shortcuts para gerente y trabajador
  protected readonly actions = [
    { label: 'Nueva venta', icon: 'M3 3h2l3 13h11l2-9H6 M10 20h.01 M18 20h.01' },
    { label: 'Registrar gasto', icon: 'M6 3h12v18l-3-2-3 2-3-2-3 2Z M9 8h6 M9 12h6' },
    { label: 'Nueva compra', icon: 'M1 4h13v13H1Z M14 8h4l4 5v4h-8 M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0' },
    { label: 'Registrar trabajador', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M20 6v6 M17 9h6' },
  ];

  protected readonly workerActions = [
    { label: 'Nueva venta', icon: 'M3 3h2l3 13h11l2-9H6 M10 20h.01 M18 20h.01' },
    { label: 'Consultar inventario', icon: 'm12 3 9 5v8l-9 5-9-5V8Z M3 8l9 5 9-5 M12 13v8' },
    { label: 'Registrar salida', icon: 'M9 21H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5 M10 12h11 M17 8l4 4-4 4' },
  ];

  //Variable para la bienvenida para gerente y trabajador
  protected get welcomeDescription(): string {
    return this.currentRole === 'GERENTE'
      ? 'Todo listo para comenzar. Aquí tienes un vistazo rápido a lo que está pasando hoy en Savia Café.'
      : 'Todo listo para tu jornada. Aquí tienes un resumen rápido de tu día en Savia Café.';
  }

  //Obtener las stats dependiendo del rol
  protected get visibleStats() {
    return this.currentRole === 'GERENTE' ? this.stats : this.workerStats;
  }

  //Obtener los accesos rápidos dependiendo del rol
  protected get visibleActions() {
    return this.currentRole === 'GERENTE' ? this.actions : this.workerActions;
  }

}
