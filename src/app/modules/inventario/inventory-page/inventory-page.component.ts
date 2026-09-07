import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ProductTableComponent } from '../product-table/product-table.component';
import { ProductFormComponent } from '../product-form/product-form.component';

export interface Product {
  readonly id: number;
  readonly nombre: string;
  readonly categoria: string;
  readonly precioVenta: number;
  readonly stockActual: number;
  readonly stockMinimo: number;
  readonly descripcion: string;
  readonly imagen: string;
  readonly estado: 'ACTIVO' | 'INACTIVO';
}

@Component({
  imports: [FormsModule, PageHeaderComponent, ModalComponent, ConfirmDialogComponent, ProductTableComponent, ProductFormComponent],
  selector: 'app-inventory-page',
  styleUrl: './inventory-page.component.css',
  templateUrl: './inventory-page.component.html',
})
export class inventoryPageComponent {
  protected readonly currentRole: 'GERENTE' | 'TRABAJADOR' = 'GERENTE'; // Cambiar a 'GERENTE' para habilitar la edición.
  protected readonly categories = ['Cafés', 'Bebidas frías', 'Tés', 'Panadería', 'Postres'];
  protected filters = { search: '', category: '', stock: '', status: '', order: 'AZ' };
  protected formOpen = false;
  protected versionSource: Product | null = null;
  protected pendingDeactivation: Product | null = null;
  protected notice = '';

  // Datos locales: una recarga restaura este catálogo.
  protected products: readonly Product[] = [
    { id: 1, nombre: 'Latte Vainilla', categoria: 'Cafés', precioVenta: 64, stockActual: 18, stockMinimo: 5, descripcion: 'Espresso con leche vaporizada y un toque de vainilla.', imagen: '', estado: 'ACTIVO' },
    { id: 2, nombre: 'Capuchino', categoria: 'Cafés', precioVenta: 56, stockActual: 3, stockMinimo: 5, descripcion: 'Espresso con leche vaporizada y espuma cremosa.', imagen: '', estado: 'ACTIVO' },
    { id: 3, nombre: 'Americano', categoria: 'Cafés', precioVenta: 40, stockActual: 26, stockMinimo: 8, descripcion: 'Espresso combinado con agua caliente.', imagen: '', estado: 'ACTIVO' },
    { id: 4, nombre: 'Mocha', categoria: 'Cafés', precioVenta: 68, stockActual: 7, stockMinimo: 4, descripcion: 'Espresso con leche vaporizada y chocolate.', imagen: '', estado: 'ACTIVO' },
    { id: 5, nombre: 'Frappé de Café', categoria: 'Bebidas frías', precioVenta: 72, stockActual: 2, stockMinimo: 4, descripcion: 'Bebida fría de café con hielo y leche.', imagen: '', estado: 'ACTIVO' },
    { id: 6, nombre: 'Té Matcha', categoria: 'Tés', precioVenta: 62, stockActual: 10, stockMinimo: 4, descripcion: 'Té matcha preparado con leche vaporizada.', imagen: '', estado: 'ACTIVO' },
    { id: 7, nombre: 'Rol de Canela', categoria: 'Panadería', precioVenta: 46, stockActual: 2, stockMinimo: 3, descripcion: 'Pan suave horneado con canela y glaseado.', imagen: '', estado: 'ACTIVO' },
    { id: 8, nombre: 'Pastel de Chocolate', categoria: 'Postres', precioVenta: 75, stockActual: 1, stockMinimo: 2, descripcion: 'Rebanada de pastel de chocolate con cobertura cremosa.', imagen: '', estado: 'ACTIVO' },
  ];

  protected stockStatus(product: Product): string {
    return product.stockActual === 0 ? 'AGOTADO'
      : product.stockActual <= product.stockMinimo ? 'STOCK BAJO' : 'DISPONIBLE';
  }

  protected get filteredProducts(): readonly Product[] {
    const f = this.filters;
    const search = f.search.trim().toLocaleLowerCase('es-MX');
    return this.products.filter((p) =>
      p.nombre.toLocaleLowerCase('es-MX').includes(search) &&
      (!f.category || p.categoria === f.category) &&
      (!f.stock || this.stockStatus(p) === f.stock) &&
      (!f.status || p.estado === f.status)
    ).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }) * (f.order === 'ZA' ? -1 : 1));
  }

  protected get summary() {
    const active = this.products.filter((p) => p.estado === 'ACTIVO');
    return [
      { label: 'Productos activos', value: active.length, tone: 'sage' },
      { label: 'Stock bajo', value: active.filter((p) => this.stockStatus(p) === 'STOCK BAJO').length, tone: 'cinnamon' },
      { label: 'Agotados', value: active.filter((p) => this.stockStatus(p) === 'AGOTADO').length, tone: 'terracotta' },
    ];
  }

  protected clearFilters(): void {
    this.filters = { search: '', category: '', stock: '', status: '', order: 'AZ' };
  }

  protected openCreate(): void {
    if (this.currentRole !== 'GERENTE') return;
    this.versionSource = null;
    this.formOpen = true;
    this.notice = '';
  }

  protected openVersion(product: Product): void {
    if (this.currentRole !== 'GERENTE') return;
    this.versionSource = product;
    this.formOpen = true;
    this.notice = '';
  }

  protected closeForm(): void {
    this.formOpen = false;
    this.versionSource = null;
  }

  protected saveProduct(value: Omit<Product, 'id' | 'estado'>): void {
    if (this.currentRole !== 'GERENTE' || !this.formOpen) return;
    const source = this.versionSource;
    const product: Product = {
      ...value,
      id: Math.max(0, ...this.products.map((p) => p.id)) + 1,
      estado: 'ACTIVO',
      // Una versión conserva existencias; este formulario no realiza ajustes de stock.
      stockActual: source ? source.stockActual : value.stockActual,
    };
    this.products = [
      ...this.products.map((p): Product => p.id === source?.id ? { ...p, estado: 'INACTIVO' } : p),
      product,
    ];
    this.closeForm();
    this.notice = source ? 'Nueva versión creada. El registro anterior permanece inactivo.' : 'Producto registrado correctamente.';
    if (!this.filteredProducts.some((p) => p.id === product.id)) {
      this.notice += ' El nuevo producto no coincide con los filtros actuales.';
    }
  }

  protected requestDeactivation(product: Product): void {
    if (this.currentRole === 'GERENTE' && product.estado === 'ACTIVO') {
      this.pendingDeactivation = product;
    }
  }

  protected deactivate(): void {
    if (this.currentRole !== 'GERENTE' || !this.pendingDeactivation) return;
    const id = this.pendingDeactivation.id;
    this.products = this.products.map((p): Product => p.id === id ? { ...p, estado: 'INACTIVO' } : p);
    this.pendingDeactivation = null;
    this.notice = 'Producto desactivado. Puedes consultarlo con el filtro de estado Todos o Inactivo.';
  }
}
