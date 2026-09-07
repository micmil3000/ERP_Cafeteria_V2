import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';
import type { Sale, SalesNavigationState } from '../../ventas/sales-page/sales-page.component';

@Component({
  imports: [ModalComponent, BadgeComponent, InvoiceFormComponent],
  selector: 'app-ticket-page.component',
  styleUrl: './ticket-page.component.css',
  templateUrl: './ticket-page.component.html',
})
export class TicketPageComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  protected session: SalesNavigationState | null = null;
  protected sale: Sale | null = null;
  protected invoiceOpen = false;
  protected notice = '';

  constructor() {
    const state = (this.router.currentNavigation()?.extras.state ?? this.location.getState()) as { salesSession?: SalesNavigationState } | null;
    const session = state?.salesSession;
    if (!session || !Array.isArray(session.sales) || !Array.isArray(session.products)) return;
    const sale = session.sales.find((item) => item?.id === session.saleId);
    if (!sale || !Array.isArray(sale.items) || !sale.items.length || !Number.isFinite(sale.total) ||
        !Number.isFinite(sale.subtotal) || !Number.isFinite(sale.iva) || !Number.isFinite(Date.parse(sale.fechaHora))) return;
    this.session = session;
    this.sale = sale;
  }

  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  protected date(value: string): string {
    return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Mexico_City' }).format(new Date(value));
  }

  protected time(value: string): string {
    return new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Mexico_City' }).format(new Date(value));
  }

  protected finish(): void {
    void this.router.navigate(['/ventas'], {
      replaceUrl: true,
      state: this.session ? { salesSession: { products: this.session.products, sales: this.session.sales } } : {},
    });
  }

  protected openInvoice(): void {
    if (this.sale && !this.sale.factura) this.invoiceOpen = true;
  }

  protected generateInvoice(fiscal: Omit<NonNullable<Sale['factura']>, 'xml'>): void {
    const sale = this.sale;
    if (!this.invoiceOpen || !sale || sale.factura || !this.session) return;
    if (Object.values(fiscal).some((value) => typeof value !== 'string' || !value.trim())) return;
    const factura = { ...fiscal, xml: this.invoiceXml(sale, fiscal) };
    this.sale = { ...sale, factura };
    this.session = { ...this.session, sales: this.session.sales.map((item) => item.id === sale.id ? this.sale! : item) };
    // Conserva la factura en esta entrada del Router para evitar duplicados tras recargar.
    this.location.replaceState(this.router.url, '', {
      ...(this.location.getState() as object), salesSession: this.session,
    });
    this.invoiceOpen = false;
    this.notice = 'Factura generada correctamente.';
    this.downloadXml();
  }

  protected downloadXml(): void {
    if (!this.sale?.factura?.xml) return;
    const url = URL.createObjectURL(new Blob([this.sale.factura.xml], { type: 'application/xml;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'factura-venta-' + this.sale.id + '.xml';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  private invoiceXml(sale: Sale, fiscal: Omit<NonNullable<Sale['factura']>, 'xml'>): string {
    const escape = (value: string | number): string => String(value)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<FacturaSimulada moneda="MXN" sinValidezFiscal="true">',
      '  <Venta numero="' + sale.id + '" fecha="' + escape(sale.fechaHora) + '" />',
      '  <Receptor rfc="' + escape(fiscal.rfc) + '" nombre="' + escape(fiscal.nombre) +
        '" codigoPostal="' + escape(fiscal.codigoPostal) + '" regimen="' + escape(fiscal.regimen) + '" uso="' + escape(fiscal.uso) + '" />',
      '  <Productos>',
      ...sale.items.map((item) => '    <Producto nombre="' + escape(item.nombre) + '" cantidad="' + item.cantidad +
        '" precioUnitario="' + item.precio.toFixed(2) + '" importe="' + (Math.round(item.precio * 100) * item.cantidad / 100).toFixed(2) + '" />'),
      '  </Productos>',
      '  <Totales subtotal="' + sale.subtotal.toFixed(2) + '" tasaIVA="0.16" iva="' + sale.iva.toFixed(2) + '" total="' + sale.total.toFixed(2) + '" />',
      '</FacturaSimulada>',
    ].join('\n');
  }


}
