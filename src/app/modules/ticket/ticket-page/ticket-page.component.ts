import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';
import { EstadoNavegacionVentas as SalesNavigationState, VentaVista as Sale } from '../../../models/venta.model';
import { FacturaService } from '../../../services/factura.service';

@Component({
  imports: [ModalComponent, BadgeComponent, InvoiceFormComponent],
  selector: 'app-ticket-page.component',
  styleUrl: './ticket-page.component.css',
  templateUrl: './ticket-page.component.html',
})
export class TicketPageComponent {
  //Variables para controlar la venta, la factura y los avisos
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly facturaService = inject(FacturaService);
  protected session: SalesNavigationState | null = null;
  protected sale: Sale | null = null;
  protected invoiceOpen = false;
  protected notice = '';

  //Recupera y valida la venta seleccionada
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

  //Devuelve valor de dinero en moneda mexicana
  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  //Devuelve la fecha con formato mexicano
  protected date(value: string): string {
    return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Mexico_City' }).format(new Date(value));
  }

  //Devuelve la hora con formato mexicano
  protected time(value: string): string {
    return new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Mexico_City' }).format(new Date(value));
  }

  //Método para finalizar y volver a ventas
  protected finish(): void {
    void this.router.navigate(['/ventas'], {
      replaceUrl: true,
      state: this.session ? { salesSession: { products: this.session.products, sales: this.session.sales } } : {},
    });
  }

  //Método para abrir el formulario de factura
  protected openInvoice(): void {
    if (this.sale && !this.sale.factura) this.invoiceOpen = true;
  }

  //Método para generar y guardar la factura
  protected generateInvoice(fiscal: Omit<NonNullable<Sale['factura']>, 'xml'>): void {
    const sale = this.sale;
    if (!this.invoiceOpen || !sale || sale.factura || !this.session) return;
    if (Object.values(fiscal).some((value) => typeof value !== 'string' || !value.trim())) return;
    const factura = { ...fiscal, xml: this.invoiceXml(sale, fiscal) };

    this.facturaService.registrar({
      ventaId: sale.id,
      rfc: fiscal.rfc,
      nombreRazonSocial: fiscal.nombre,
      codigoPostal: fiscal.codigoPostal,
      regimenFiscal: fiscal.regimen,
      usoFactura: fiscal.uso,
      facturaXml: factura.xml
    }).subscribe({
      next: () => {
        this.sale = { ...sale, factura };
        this.session = {
          ...this.session!,
          sales: this.session!.sales.map((item) => item.id === sale.id ? this.sale! : item)
        };

        //Conserva la factura en la navegación después de guardarla
        this.location.replaceState(this.router.url, '', {
          ...(this.location.getState() as object),
          salesSession: this.session
        });

        this.invoiceOpen = false;
        this.notice = 'Factura generada correctamente.';
        this.downloadXml();
      },
      error: (error) => {
        console.error('Error al guardar factura: ', error);
        this.notice = 'No fue posible guardar la factura.';
      }
    });
  }

  //Método para descargar el archivo XML
  protected downloadXml(): void {
    if (!this.sale?.factura?.xml) return;
    const url = URL.createObjectURL(new Blob([this.sale.factura.xml], { type: 'application/xml;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'factura-venta-' + this.sale.id + '.xml';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  //Genera el contenido XML de la factura
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
