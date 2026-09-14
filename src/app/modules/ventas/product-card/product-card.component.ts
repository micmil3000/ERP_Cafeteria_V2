import { Component, input, output } from '@angular/core';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import { ProductoVenta as Product } from '../../../models/venta.model';

@Component({
  imports: [BadgeComponent],
  selector: 'app-product-card',
  styleUrl: './product-card.component.css',
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  //Variables para recibir el producto y agregarlo a la venta
  readonly product = input.required<Product>();
  readonly add = output<Product>();
  protected failedImage = '';

  //Obtiene el estado de disponibilidad del producto
  protected get availability() {
    const p = this.product();
    return p.stock === 0 ? { text: 'AGOTADO', variant: 'danger' as const }
      : p.stock <= p.stockMinimo ? { text: 'STOCK BAJO', variant: 'warning' as const }
      : { text: 'DISPONIBLE', variant: 'success' as const };
  }

  //Devuelve valor de dinero en moneda mexicana
  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  //Método para agregar el producto a la venta
  protected addProduct(): void {
    if (this.product().stock > 0) this.add.emit(this.product());
  }
}
