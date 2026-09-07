import { Component, input, output } from '@angular/core';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import type { Sale } from '../sales-page/sales-page.component';

@Component({
  imports: [ModalComponent, BadgeComponent],
  selector: 'app-sale-detail-modal',
  styleUrl: './sale-detail-modal.component.css',
  templateUrl: './sale-detail-modal.component.html',
})
export class SaleDetailModalComponent {
  readonly sale = input.required<Sale>();
  readonly close = output<void>();

  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  protected date(value: string): string {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Mexico_City' }).format(new Date(value));
  }
}
