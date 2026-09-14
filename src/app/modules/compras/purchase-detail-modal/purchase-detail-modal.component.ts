import { Component, input, output } from '@angular/core';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { Compra } from '../../../models/compra.model';

@Component({
  imports: [ModalComponent],
  selector: 'app-purchase-detail-modal.component',
  styleUrl: './purchase-detail-modal.component.css',
  templateUrl: './purchase-detail-modal.component.html',
})

//Componente reutilizable para mostrar la información de una compra
export class PurchaseDetailModalComponent {
  //Dato que recibe el componente con toda la información de la compra
  readonly purchase = input.required<Compra>();
  //Evento que emite al padre para cerrar el modal
  readonly close = output<void>();
  //Devuelve el precio en el formato de moneda mexicana
  protected money(value: number): string { 
    return new Intl.NumberFormat(
      'es-MX', 
      { 
        style: 'currency', 
        currency: 'MXN' 
      }
    ).format(value); 
  }
  //Devuelve la fecha y hora en formato mexicano y con la zona horaria de Ciudad de México.
  protected date(value: string): string {
    return new Intl.DateTimeFormat(
      'es-MX', 
      { 
        dateStyle: 'short', 
        timeStyle: 'short', 
        timeZone: 'America/Mexico_City' 
      }
    ).format(new Date(value));
  }
}
