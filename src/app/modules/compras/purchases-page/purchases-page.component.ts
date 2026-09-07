import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { TabsComponent } from '../../../shared/tabs/tabs.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ProviderFormComponent } from '../provider-form/provider-form.component';
import { ProviderProductsDrawerComponent } from '../provider-products-drawer/provider-products-drawer.component';
import { PurchaseDetailModalComponent } from '../purchase-detail-modal/purchase-detail-modal.component';

export interface Provider {
  readonly id: number;
  readonly nombre: string;
  readonly contacto: string;
  readonly telefono: string;
  readonly correo: string;
  readonly direccion: string;
  readonly estado: 'ACTIVO' | 'INACTIVO';
}
export interface Product {
  readonly id: number;
  readonly nombre: string;
  readonly categoria: string;
  readonly stockActual: number;
  readonly stockMinimo: number;
}
export interface ProviderProduct {
  readonly proveedorId: number;
  readonly productoId: number;
  readonly precioCompra: number;
}
export interface PurchaseDetail {
  readonly productoId: number;
  readonly nombre: string;
  readonly cantidad: number;
  readonly precioCompra: number;
}
export interface Purchase {
  readonly id: number;
  readonly fechaHora: string;
  readonly proveedorId: number;
  readonly proveedorNombre: string;
  readonly detalles: readonly PurchaseDetail[];
  readonly subtotal: number;
  readonly iva: number;
  readonly total: number;
  readonly usuarioResponsable: string;
}

@Component({
  imports: [FormsModule, PageHeaderComponent, TabsComponent, BadgeComponent, DataTableComponent, ModalComponent,
    ConfirmDialogComponent, ProviderFormComponent, ProviderProductsDrawerComponent, PurchaseDetailModalComponent],
  selector: 'app-purchases-page.component',
  styleUrl: './purchases-page.component.css',
  templateUrl: './purchases-page.component.html',
})
export class PurchasesPageComponent {
  protected readonly currentRole: 'GERENTE' | 'TRABAJADOR' = 'GERENTE';
  protected readonly tabs = [{ id: 'purchases', label: 'Compras' }, { id: 'providers', label: 'Proveedores' }];
  protected activeTab = 'purchases';
  protected purchaseView = 'new';
  protected search = '';
  protected selectedProviderId: number | null = null;
  protected cart: readonly { productoId: number; cantidad: number }[] = [];
  protected providerFormOpen = false;
  protected editingProvider: Provider | null = null;
  protected drawerProviderId: number | null = null;
  protected pendingDeactivation: Provider | null = null;
  protected confirmingPurchase = false;
  protected selectedPurchase: Purchase | null = null;
  protected notice = '';

  protected providers: readonly Provider[] = [
    { id: 1, nombre: 'Café Sierra Dorada', contacto: 'Mariana Ruiz', telefono: '3315872460', correo: 'ventas@sierra.example', direccion: 'Av. Vallarta 1840, Guadalajara', estado: 'ACTIVO' },
    { id: 2, nombre: 'Insumos Café del Centro', contacto: 'Carlos Navarro', telefono: '3326741958', correo: 'pedidos@insumoscentro.example', direccion: 'Calle Morelos 625, Guadalajara', estado: 'ACTIVO' },
    { id: 3, nombre: 'Horno y Dulce Artesanal', contacto: 'Sofía Ramírez', telefono: '3337614285', correo: 'contacto@hornodulce.example', direccion: 'Av. Federalismo 910, Guadalajara', estado: 'ACTIVO' },
    { id: 4, nombre: 'Lácteos Santa Clara', contacto: 'Ricardo Salazar', telefono: '3348523176', correo: 'ventas@santaclara.example', direccion: 'Calle Fresno 142, Guadalajara', estado: 'INACTIVO' },
  ];

  protected products: readonly Product[] = [
    { id: 1, nombre: 'Latte Vainilla', categoria: 'Cafés', stockActual: 18, stockMinimo: 5 },
    { id: 2, nombre: 'Capuchino', categoria: 'Cafés', stockActual: 3, stockMinimo: 5 },
    { id: 3, nombre: 'Americano', categoria: 'Cafés', stockActual: 26, stockMinimo: 8 },
    { id: 4, nombre: 'Mocha', categoria: 'Cafés', stockActual: 7, stockMinimo: 4 },
    { id: 5, nombre: 'Frappé de Café', categoria: 'Bebidas frías', stockActual: 2, stockMinimo: 4 },
    { id: 6, nombre: 'Té Matcha', categoria: 'Tés', stockActual: 10, stockMinimo: 4 },
    { id: 7, nombre: 'Rol de Canela', categoria: 'Panadería', stockActual: 2, stockMinimo: 3 },
    { id: 8, nombre: 'Pastel de Chocolate', categoria: 'Postres', stockActual: 1, stockMinimo: 2 },
  ];

  protected associations: readonly ProviderProduct[] = [
    { proveedorId: 1, productoId: 1, precioCompra: 33 },
    { proveedorId: 1, productoId: 2, precioCompra: 30 },
    { proveedorId: 1, productoId: 3, precioCompra: 20 },
    { proveedorId: 1, productoId: 5, precioCompra: 38 },
    { proveedorId: 2, productoId: 1, precioCompra: 32 },
    { proveedorId: 2, productoId: 4, precioCompra: 37 },
    { proveedorId: 2, productoId: 6, precioCompra: 28 },
    { proveedorId: 3, productoId: 7, precioCompra: 21 },
    { proveedorId: 3, productoId: 8, precioCompra: 40 },
    { proveedorId: 4, productoId: 2, precioCompra: 29 },
  ];

  protected purchases: readonly Purchase[] = [
    this.mockPurchase(301, 1, 3, 15, 19, '2026-09-01T08:45:00-06:00'),
    this.mockPurchase(302, 3, 7, 10, 20, '2026-09-02T11:15:00-06:00'),
    this.mockPurchase(303, 2, 6, 12, 27, '2026-09-04T09:30:00-06:00'),
    this.mockPurchase(304, 1, 2, 8, 29, '2026-09-06T10:20:00-06:00'),
  ];

  protected get activeProviders() { return this.providers.filter((p) => p.estado === 'ACTIVO'); }
  protected get filteredProviders() {
    const query = this.search.trim().toLocaleLowerCase('es-MX');
    return this.providers.filter((p) => (p.nombre + ' ' + p.contacto).toLocaleLowerCase('es-MX').includes(query));
  }
  protected get drawerProvider() { return this.providers.find((p) => p.id === this.drawerProviderId); }
  protected get availableProducts() {
    if (!this.activeProviders.some((p) => p.id === this.selectedProviderId)) return [];
    return this.associations.filter((a) => a.proveedorId === this.selectedProviderId).map((a) => ({
      ...this.products.find((p) => p.id === a.productoId)!, precioCompra: a.precioCompra,
    }));
  }
  protected get lines(): readonly PurchaseDetail[] {
    return this.cart.map((line) => {
      const product = this.products.find((p) => p.id === line.productoId);
      const association = this.associations.find((a) => a.proveedorId === this.selectedProviderId && a.productoId === line.productoId);
      return { ...line, nombre: product?.nombre ?? 'Producto no disponible', precioCompra: association?.precioCompra ?? 0 };
    });
  }
  protected get subtotal(): number {
    return this.lines.reduce((sum, line) => sum + (Number.isInteger(line.cantidad) && line.cantidad > 0
      ? Math.round(line.precioCompra * 100) * line.cantidad : 0), 0) / 100;
  }
  protected get iva(): number { return Math.round(Math.round(this.subtotal * 100) * 0.16) / 100; }
  protected get total(): number { return (Math.round(this.subtotal * 100) + Math.round(this.iva * 100)) / 100; }
  protected get canConfirm(): boolean {
    return this.currentRole === 'GERENTE' && this.activeProviders.some((p) => p.id === this.selectedProviderId) &&
      this.lines.length > 0 && this.lines.every((l) => Number.isInteger(l.cantidad) && l.cantidad > 0 && l.cantidad <= 1000000 &&
        this.validPrice(l.precioCompra) && this.products.some((p) => p.id === l.productoId));
  }
  protected associationCount(providerId: number): number { return this.associations.filter((a) => a.proveedorId === providerId).length; }
  protected money(value: number): string { return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value); }
  protected date(value: string): string {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Mexico_City' }).format(new Date(value));
  }
  private validPrice(value: number): boolean {
    return Number.isFinite(value) && value > 0 && value <= 1000000 && Math.abs(value * 100 - Math.round(value * 100)) < 0.000001;
  }

  protected openProvider(provider: Provider | null = null): void {
    if (this.currentRole !== 'GERENTE') return;
    this.editingProvider = provider;
    this.providerFormOpen = true;
  }
  protected saveProvider(value: Omit<Provider, 'id' | 'estado'>): void {
    if (this.currentRole !== 'GERENTE' || !this.providerFormOpen) return;
    this.providers = this.editingProvider
      ? this.providers.map((p) => p.id === this.editingProvider!.id ? { ...p, ...value } : p)
      : [...this.providers, { ...value, id: Math.max(0, ...this.providers.map((p) => p.id)) + 1, estado: 'ACTIVO' }];
    this.providerFormOpen = false;
    this.editingProvider = null;
    this.notice = 'Proveedor guardado correctamente.';
  }
  protected deactivateProvider(): void {
    if (this.currentRole !== 'GERENTE' || !this.pendingDeactivation) return;
    const id = this.pendingDeactivation.id;
    this.providers = this.providers.map((p) => p.id === id ? { ...p, estado: 'INACTIVO' } : p);
    if (this.selectedProviderId === id) this.changeProvider(null);
    this.pendingDeactivation = null;
    this.notice = 'Proveedor desactivado. Se conserva para consulta.';
  }
  protected addAssociation(value: { productoId: number; precioCompra: number }): void {
    const id = this.drawerProviderId;
    if (this.currentRole !== 'GERENTE' || !this.drawerProvider || !id || !this.validPrice(value.precioCompra) ||
      !this.products.some((p) => p.id === value.productoId) ||
      this.associations.some((a) => a.proveedorId === id && a.productoId === value.productoId)) return;
    this.associations = [...this.associations, { proveedorId: id, ...value }];
  }
  protected updatePrice(value: { productoId: number; precioCompra: number }): void {
    if (this.currentRole !== 'GERENTE' || !this.drawerProvider || !this.validPrice(value.precioCompra)) return;
    this.associations = this.associations.map((a) => a.proveedorId === this.drawerProviderId && a.productoId === value.productoId
      ? { ...a, precioCompra: value.precioCompra } : a);
  }
  protected removeAssociation(productoId: number): void {
    if (this.currentRole !== 'GERENTE' || !this.drawerProvider) return;
    this.associations = this.associations.filter((a) => !(a.proveedorId === this.drawerProviderId && a.productoId === productoId));
    if (this.selectedProviderId === this.drawerProviderId) this.removeLine(productoId);
  }
  protected changeProvider(id: number | null): void {
    if (this.currentRole !== 'GERENTE') return;
    this.selectedProviderId = this.activeProviders.some((p) => p.id === id) ? id : null;
    this.cart = [];
    this.notice = '';
  }
  protected addProduct(id: number): void {
    if (this.currentRole !== 'GERENTE' || !this.availableProducts.some((p) => p.id === id)) return;
    const line = this.cart.find((l) => l.productoId === id);
    if (line) this.setQuantity(id, line.cantidad + 1);
    else this.cart = [...this.cart, { productoId: id, cantidad: 1 }];
  }
  protected setQuantity(id: number, value: number | null): void {
    if (this.currentRole !== 'GERENTE') return;
    this.cart = this.cart.map((l) => l.productoId === id ? { ...l, cantidad: value ?? 0 } : l);
  }
  protected removeLine(id: number): void {
    if (this.currentRole !== 'GERENTE') return;
    this.cart = this.cart.filter((l) => l.productoId !== id);
  }
  protected requestConfirmation(): void {
    if (this.canConfirm) this.confirmingPurchase = true;
  }
  protected confirmPurchase(): void {
    if (!this.confirmingPurchase || !this.canConfirm) { this.confirmingPurchase = false; return; }
    const provider = this.activeProviders.find((p) => p.id === this.selectedProviderId)!;
    const purchase: Purchase = {
      id: Math.max(0, ...this.purchases.map((p) => p.id)) + 1,
      fechaHora: new Date().toISOString(), proveedorId: provider.id, proveedorNombre: provider.nombre,
      detalles: this.lines.map((line) => ({ ...line })), subtotal: this.subtotal, iva: this.iva, total: this.total,
      usuarioResponsable: 'Ana Torres',
    };
    this.products = this.products.map((p) => ({ ...p,
      stockActual: p.stockActual + (purchase.detalles.find((l) => l.productoId === p.id)?.cantidad ?? 0),
    }));
    this.purchases = [purchase, ...this.purchases];
    this.cart = [];
    this.selectedProviderId = null;
    this.confirmingPurchase = false;
    this.notice = 'Compra #' + purchase.id + ' registrada correctamente.';
    this.purchaseView = 'history';
  }
  private mockPurchase(id: number, providerId: number, productId: number, quantity: number, price: number, date: string): Purchase {
    const cents = Math.round(price * 100) * quantity;
    const tax = Math.round(cents * 0.16);
    return { id, fechaHora: date, proveedorId: providerId, proveedorNombre: this.providers.find((p) => p.id === providerId)!.nombre,
      detalles: [{ productoId: productId, nombre: this.products.find((p) => p.id === productId)!.nombre, cantidad: quantity, precioCompra: price }],
      subtotal: cents / 100, iva: tax / 100, total: (cents + tax) / 100, usuarioResponsable: 'Ana Torres' };
  }
}
