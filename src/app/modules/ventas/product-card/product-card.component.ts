import { Component, input, output } from '@angular/core';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import type { Product } from '../sales-page/sales-page.component';

@Component({
  imports: [BadgeComponent],
  selector: 'app-product-card',
  styleUrl: './product-card.component.css',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly add = output<Product>();
  protected failedImage = '';

  protected get availability() {
    const p = this.product();
    return p.stock === 0 ? { text: 'AGOTADO', variant: 'danger' as const }
      : p.stock <= p.stockMinimo ? { text: 'STOCK BAJO', variant: 'warning' as const }
      : { text: 'DISPONIBLE', variant: 'success' as const };
  }

  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  protected addProduct(): void {
    if (this.product().stock > 0) this.add.emit(this.product());
  }
}
