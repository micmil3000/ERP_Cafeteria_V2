import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-data-table',
  styleUrl: './data-table.component.css',
  templateUrl: './data-table.component.html',
  // Permite estilizar las clases BEM del contenido proyectado, limitadas a app-data-table.
  encapsulation: ViewEncapsulation.None,
})

//Componente reutilizable para mostrar una tabla de datos. 
export class DataTableComponent {

  //Propiedades de entrada del componente para personalizar su comportamiento y apariencia.
  label = input<string>('Tabla de datos');
  empty = input<boolean>(false);
  emptyMessage = input<string>('No hay registros para mostrar.');
  columnCount = input<number>(1);
}
