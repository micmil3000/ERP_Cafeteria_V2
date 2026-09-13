import { Component, input, output } from '@angular/core';
import type { CartItem } from '../sales-page/sales-page.component';

@Component({
  imports: [],
  selector: 'app-sale-summary',
  styleUrl: './sale-summary.component.css',
  templateUrl: './sale-summary.component.html',
})
export class SaleSummaryComponent {
  //Variables para recibir el resumen y controlar el carrito
  readonly items = input.required<readonly CartItem[]>();
  readonly subtotal = input.required<number>();
  readonly iva = input.required<number>();
  readonly total = input.required<number>();
  readonly message = input('');
  readonly increase = output<number>();
  readonly decrease = output<number>();
  readonly remove = output<number>();
  readonly checkout = output<void>();
  readonly cancel = output<void>();

  //Devuelve valor de dinero en moneda mexicana
  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }
}
