import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { TabsComponent } from '../../../shared/tabs/tabs.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SaleSummaryComponent } from '../sale-summary/sale-summary.component';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { SaleDetailModalComponent } from '../sale-detail-modal/sale-detail-modal.component';

export interface Product {
  readonly id: number;
  readonly nombre: string;
  readonly categoria: string;
  readonly precio: number;
  readonly stock: number;
  readonly stockMinimo: number;
  readonly imagen: string;
}

export interface CartItem {
  readonly productId: number;
  readonly nombre: string;
  readonly precio: number;
  readonly cantidad: number;
}

export interface Sale {
  readonly id: number;
  readonly fechaHora: string;
  readonly items: readonly CartItem[];
  readonly subtotal: number;
  readonly iva: number;
  readonly total: number;
  readonly metodoPago: string;
  readonly referencia?: string;
  readonly usuario: string;
  readonly factura?: {
    readonly rfc: string;
    readonly nombre: string;
    readonly codigoPostal: string;
    readonly regimen: string;
    readonly uso: string;
    readonly xml: string;
  };
}

export interface SalesNavigationState {
  readonly products: readonly Product[];
  readonly sales: readonly Sale[];
  readonly saleId?: number;
}

@Component({
  imports: [FormsModule, PageHeaderComponent, TabsComponent, BadgeComponent, DataTableComponent,
    ConfirmDialogComponent, ProductCardComponent, SaleSummaryComponent, PaymentModalComponent, SaleDetailModalComponent],
  selector: 'app-sales-page',
  styleUrl: './sales-page.component.css',
  templateUrl: './sales-page.component.html',
})
export class SalesPageComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  constructor() {
    const state = (this.router.currentNavigation()?.extras.state ?? this.location.getState()) as { salesSession?: SalesNavigationState } | null;
    const session = state?.salesSession;
    if (session && Array.isArray(session.products) && Array.isArray(session.sales)) {
      this.products = session.products;
      this.sales = session.sales;
    }
  }

  protected readonly currentRole: 'GERENTE' | 'TRABAJADOR' = 'GERENTE';
  protected readonly currentUser = 'Ana Torres';
  protected readonly tabs = [{ id: 'new', label: 'Nueva venta' }, { id: 'history', label: 'Historial' }];
  protected readonly categories = ['Cafés', 'Bebidas frías', 'Tés', 'Panadería', 'Postres'];
  protected activeTab = 'new';
  protected search = '';
  protected category = '';
  protected cart: readonly CartItem[] = [];
  protected message = '';
  protected paymentOpen = false;
  protected paymentError = '';
  protected cancelOpen = false;
  protected selectedSale: Sale | null = null;

  // Catálogo independiente para esta práctica, sin sincronización con Inventario.
  protected products: readonly Product[] = [
    { id: 1, nombre: 'Latte Vainilla', categoria: 'Cafés', precio: 64, stock: 18, stockMinimo: 5, imagen: '/images/latte-vainilla.jpg' },
    { id: 2, nombre: 'Capuchino', categoria: 'Cafés', precio: 56, stock: 3, stockMinimo: 5, imagen: '/images/capuchino.jpg' },
    { id: 3, nombre: 'Americano', categoria: 'Cafés', precio: 40, stock: 26, stockMinimo: 8, imagen: '/images/americano.jpg' },
    { id: 4, nombre: 'Mocha', categoria: 'Cafés', precio: 68, stock: 7, stockMinimo: 4, imagen: '/images/mocha.jpg' },
    { id: 5, nombre: 'Frappé de Café', categoria: 'Bebidas frías', precio: 72, stock: 2, stockMinimo: 4, imagen: '/images/frappe-cafe.jpg' },
    { id: 6, nombre: 'Té Matcha', categoria: 'Tés', precio: 62, stock: 10, stockMinimo: 4, imagen: '/images/te-matcha.jpg' },
    { id: 7, nombre: 'Rol de Canela', categoria: 'Panadería', precio: 46, stock: 2, stockMinimo: 3, imagen: '/images/rol-canela.jpg' },
    { id: 8, nombre: 'Pastel de Chocolate', categoria: 'Postres', precio: 75, stock: 1, stockMinimo: 2, imagen: '/images/pastel-chocolate.jpg' },
  ];

  protected sales: readonly Sale[] = [
    this.mockSale(1051, '2026-09-03T09:20:00-06:00', 'Ana Torres', 1, 2, 'Efectivo', true),
    this.mockSale(1052, '2026-09-04T11:10:00-06:00', 'Carlos Ruiz', 3, 3, 'Tarjeta', false),
    this.mockSale(1053, '2026-09-05T13:45:00-06:00', 'Ana Torres', 6, 2, 'Transferencia', false),
    this.mockSale(1054, '2026-09-06T08:35:00-06:00', 'Carlos Ruiz', 7, 2, 'Efectivo', true),
  ];

  protected get filteredProducts() {
    const query = this.search.trim().toLocaleLowerCase('es-MX');
    return this.products.filter((p) => p.nombre.toLocaleLowerCase('es-MX').includes(query) && (!this.category || p.categoria === this.category));
  }

  protected get visibleSales() {
    return this.sales.filter((s) => this.currentRole === 'GERENTE' || s.usuario === this.currentUser)
      .sort((a, b) => b.id - a.id);
  }

  protected get subtotal(): number {
    return this.cart.reduce((sum, item) => sum + Math.round(item.precio * 100) * item.cantidad, 0) / 100;
  }
  protected get iva(): number { return Math.round(Math.round(this.subtotal * 100) * 0.16) / 100; }
  protected get total(): number { return (Math.round(this.subtotal * 100) + Math.round(this.iva * 100)) / 100; }

  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }
  protected date(value: string): string {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Mexico_City' }).format(new Date(value));
  }

  protected addProduct(product: Product): void {
    if (this.paymentOpen) return;
    const current = this.products.find((p) => p.id === product.id);
    if (!current) return;
    const line = this.cart.find((item) => item.productId === current.id);
    if ((line?.cantidad ?? 0) >= current.stock) {
      this.message = 'No hay más existencias de ' + current.nombre + '.';
      return;
    }
    this.cart = line
      ? this.cart.map((item) => item.productId === current.id ? { ...item, cantidad: item.cantidad + 1 } : item)
      : [...this.cart, { productId: current.id, nombre: current.nombre, precio: current.precio, cantidad: 1 }];
    this.message = '';
  }

  protected increase(id: number): void {
    const product = this.products.find((p) => p.id === id);
    if (product) this.addProduct(product);
  }

  protected decrease(id: number): void {
    if (this.paymentOpen) return;
    this.cart = this.cart.map((item) => item.productId === id && item.cantidad > 1 ? { ...item, cantidad: item.cantidad - 1 } : item);
    this.message = '';
  }

  protected remove(id: number): void {
    if (this.paymentOpen) return;
    this.cart = this.cart.filter((item) => item.productId !== id);
    this.message = '';
  }

  protected cancelSale(): void {
    if (!this.cancelOpen || this.paymentOpen) return;
    this.cart = [];
    this.cancelOpen = false;
    this.message = 'Venta en preparación cancelada. No se modificaron existencias.';
  }

  private stockError(): string {
    if (!this.cart.length) return 'Agrega productos antes de cobrar.';
    const invalid = this.cart.find((item) => {
      const product = this.products.find((p) => p.id === item.productId);
      return !product || !Number.isInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > product.stock;
    });
    return invalid ? 'Revisa ' + invalid.nombre + ': no hay stock suficiente para la cantidad solicitada.' : '';
  }

  protected checkout(): void {
    this.message = this.stockError();
    if (this.message) return;
    this.paymentError = '';
    this.paymentOpen = true;
  }

  protected confirmPayment(result: { approved: boolean; method: string }): void {
    if (!this.paymentOpen || !result.approved || !['Efectivo', 'Tarjeta', 'Transferencia'].includes(result.method)) return;
    this.paymentError = this.stockError();
    if (this.paymentError) return;
    const id = Math.max(0, ...this.sales.map((sale) => sale.id)) + 1;
    const sale: Sale = {
      id, fechaHora: new Date().toISOString(), items: this.cart.map((item) => ({ ...item })),
      subtotal: this.subtotal, iva: this.iva, total: this.total, metodoPago: result.method,
      referencia: 'SIM-' + id, usuario: this.currentUser,
    };
    this.products = this.products.map((product) => ({
      ...product, stock: product.stock - (this.cart.find((item) => item.productId === product.id)?.cantidad ?? 0),
    }));
    this.sales = [sale, ...this.sales];
    this.cart = [];
    this.paymentOpen = false;
    this.message = '';
    void this.router.navigate(['/ventas/ticket'], {
      replaceUrl: true,
      state: { salesSession: { products: this.products, sales: this.sales, saleId: sale.id } },
    });
  }

  protected openDetail(sale: Sale): void {
    this.selectedSale = this.visibleSales.find((s) => s.id === sale.id) ?? null;
  }

  private mockSale(id: number, fechaHora: string, usuario: string, productId: number, cantidad: number, metodoPago: string, invoiced: boolean): Sale {
    const product = this.products.find((p) => p.id === productId)!;
    const subtotalCents = Math.round(product.precio * 100) * cantidad;
    const ivaCents = Math.round(subtotalCents * 0.16);
    const sale: Sale = {
      id, fechaHora, usuario, metodoPago, referencia: 'SIM-' + id,
      items: [{ productId, nombre: product.nombre, precio: product.precio, cantidad }],
      subtotal: subtotalCents / 100, iva: ivaCents / 100, total: (subtotalCents + ivaCents) / 100,
    };
    if (!invoiced) return sale;
    const fiscal = { rfc: 'XAXX010101000', nombre: 'Receptor de ejemplo', codigoPostal: '44100', regimen: 'Régimen de ejemplo', uso: 'Uso de ejemplo' };
    return { ...sale, factura: { ...fiscal, xml: '' } };
  }
}
