import { Component, input, output } from '@angular/core';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import type { Product } from '../inventory-page/inventory-page.component';

@Component({
  imports: [BadgeComponent],
  selector: 'app-product-table',
  styleUrl: './product-table.component.css',
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent {
  readonly products = input.required<readonly Product[]>();
  readonly role = input.required<'GERENTE' | 'TRABAJADOR'>();
  readonly newVersion = output<Product>();
  readonly deactivate = output<Product>();
  protected readonly failedImages = new Set<string>();

  protected availability(product: Product) {
    if (product.stockActual === 0) return { label: 'AGOTADO', variant: 'danger' as const };
    if (product.stockActual <= product.stockMinimo) return { label: 'STOCK BAJO', variant: 'warning' as const };
    return { label: 'DISPONIBLE', variant: 'success' as const };
  }

  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }
}
