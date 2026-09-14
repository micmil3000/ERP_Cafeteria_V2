import { Component, input, output } from '@angular/core';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import { VentaVista as Sale } from '../../../models/venta.model';

@Component({
  imports: [ModalComponent, BadgeComponent],
  selector: 'app-sale-detail-modal',
  styleUrl: './sale-detail-modal.component.css',
  templateUrl: './sale-detail-modal.component.html',
})
export class SaleDetailModalComponent {
  //Variables para recibir la venta y cerrar el modal
  readonly sale = input.required<Sale>();
  readonly close = output<void>();

  //Devuelve valor de dinero en moneda mexicana
  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  //Devuelve fecha y hora con formato mexicano
  protected date(value: string): string {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Mexico_City' }).format(new Date(value));
  }
}
