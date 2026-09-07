import { Component, input, output } from '@angular/core';
import { ModalComponent } from '../../../shared/modal/modal.component';
import type { Purchase } from '../purchases-page/purchases-page.component';

@Component({
  imports: [ModalComponent],
  selector: 'app-purchase-detail-modal.component',
  styleUrl: './purchase-detail-modal.component.css',
  templateUrl: './purchase-detail-modal.component.html',
})
export class PurchaseDetailModalComponent {
  readonly purchase = input.required<Purchase>();
  readonly close = output<void>();
  protected money(value: number): string { return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value); }
  protected date(value: string): string {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Mexico_City' }).format(new Date(value));
  }
}
