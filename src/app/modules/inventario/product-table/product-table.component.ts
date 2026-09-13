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
  //Datos que recibe el componente: los productos disponibles y si es gerente o trabajador. Lo último es para pruebas
  readonly products = input.required<readonly Product[]>();
  readonly role = input.required<'GERENTE' | 'TRABAJADOR'>();
  //Eventos que emite al padre, al crear una nueva versión o para desactivar un producto
  readonly newVersion = output<Product>();
  readonly deactivate = output<Product>();
  //Variable para imágenes que fallan
  protected readonly failedImages = new Set<string>();

  //Devuelve el estado de los productos
  protected availability(product: Product) {
    if (product.stockActual === 0) return { label: 'AGOTADO', variant: 'danger' as const };
    if (product.stockActual <= product.stockMinimo) return { label: 'STOCK BAJO', variant: 'warning' as const };
    return { label: 'DISPONIBLE', variant: 'success' as const };
  }

  //Devuelve el valor del precio en formato de moneda mexicana
  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN' 
    }).format(value);
  }
}
