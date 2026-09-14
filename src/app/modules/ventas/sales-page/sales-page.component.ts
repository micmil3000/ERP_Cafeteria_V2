import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
import { ProductoService } from '../../../services/producto.service';
import { VentaService } from '../../../services/venta.service';
import { CarritoVenta, EstadoNavegacionVentas, ProductoVenta, Venta, VentaVista } from '../../../models/venta.model';

export type Product = ProductoVenta;
export type CartItem = CarritoVenta;
export type Sale = VentaVista;
export type SalesNavigationState = EstadoNavegacionVentas;

@Component({
  imports: [FormsModule, PageHeaderComponent, TabsComponent, BadgeComponent, DataTableComponent,
    ConfirmDialogComponent, ProductCardComponent, SaleSummaryComponent, PaymentModalComponent, SaleDetailModalComponent],
  selector: 'app-sales-page',
  styleUrl: './sales-page.component.css',
  templateUrl: './sales-page.component.html',
})
export class SalesPageComponent implements OnInit {
  //Variables para controlar la navegación y recuperar la sesión
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly productoService = inject(ProductoService);
  private readonly ventaService = inject(VentaService);
  private readonly cdr = inject(ChangeDetectorRef);

  //Recupera los productos y ventas guardados en la navegación
  constructor() {
    const state = (this.router.currentNavigation()?.extras.state ?? this.location.getState()) as { salesSession?: SalesNavigationState } | null;
    const session = state?.salesSession;
    if (session && Array.isArray(session.products) && Array.isArray(session.sales)) {
      this.products = session.products;
      this.sales = session.sales;
    }
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarVentas();
  }

  //Carga los productos desde el backend
  private cargarProductos(): void {

    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        this.products = productos.filter((producto) => producto.estado === 'ACTIVO').map((producto) => ({
          id: producto.id,
          nombre: producto.nombre,
          categoria: producto.categoria,
          precio: Number(producto.precioVenta),
          stock: producto.stockActual,
          stockMinimo: producto.stockMinimo,
          imagen: producto.imagen || ''
        }));
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar productos: ', error);
        this.message = 'No fue posible cargar los productos';
        this.cdr.markForCheck();
      }
    });

  }

  //Carga el historial de ventas desde el backend
  private cargarVentas(): void {

    this.ventaService.obtenerVentas().subscribe({
      next: (ventas) => {
        this.sales = ventas.map((venta) => ({
          id: venta.id,
          fechaHora: venta.fechaHora,
          items: Array(venta.cantidadProductos ?? 0).fill({}),
          subtotal: Number(venta.subtotal),
          iva: Number(venta.iva),
          total: Number(venta.total),
          metodoPago: '',
          usuario: venta.usuario,
          factura: venta.facturada ? {} as Sale['factura'] : undefined
        }));
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar ventas: ', error);
        this.message = 'No fue posible cargar las ventas';
        this.cdr.markForCheck();
      }
    });

  }

  //Variables para controlar rol, filtros, carrito y modales
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

  //Productos y ventas cargados desde el backend
  protected products: readonly Product[] = [];
  protected sales: readonly Sale[] = [];

  //Obtiene los productos filtrados por nombre y categoría
  protected get filteredProducts() {
    const query = this.search.trim().toLocaleLowerCase('es-MX');
    return this.products.filter((p) => p.nombre.toLocaleLowerCase('es-MX').includes(query) && (!this.category || p.categoria === this.category));
  }

  //Obtiene las ventas visibles según el rol actual
  protected get visibleSales() {
    return this.sales.filter((s) => this.currentRole === 'GERENTE' || s.usuario === this.currentUser)
      .sort((a, b) => b.id - a.id);
  }

  //Calcula el subtotal, IVA y total del carrito
  protected get subtotal(): number {
    return this.cart.reduce((sum, item) => sum + Math.round(item.precio * 100) * item.cantidad, 0) / 100;
  }
  protected get iva(): number { return Math.round(Math.round(this.subtotal * 100) * 0.16) / 100; }
  protected get total(): number { return (Math.round(this.subtotal * 100) + Math.round(this.iva * 100)) / 100; }

  //Métodos para mostrar dinero, fecha y hora
  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }
  protected date(value: string): string {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Mexico_City' }).format(new Date(value));
  }

  //Método para agregar un producto al carrito
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

  //Método para aumentar la cantidad de un producto
  protected increase(id: number): void {
    const product = this.products.find((p) => p.id === id);
    if (product) this.addProduct(product);
  }

  //Método para disminuir la cantidad de un producto
  protected decrease(id: number): void {
    if (this.paymentOpen) return;
    this.cart = this.cart.map((item) => item.productId === id && item.cantidad > 1 ? { ...item, cantidad: item.cantidad - 1 } : item);
    this.message = '';
  }

  //Método para eliminar un producto del carrito
  protected remove(id: number): void {
    if (this.paymentOpen) return;
    this.cart = this.cart.filter((item) => item.productId !== id);
    this.message = '';
  }

  //Método para cancelar la venta actual
  protected cancelSale(): void {
    if (!this.cancelOpen || this.paymentOpen) return;
    this.cart = [];
    this.cancelOpen = false;
    this.message = 'Venta en preparación cancelada. No se modificaron existencias.';
  }

  //Valida las existencias antes de cobrar
  private stockError(): string {
    if (!this.cart.length) return 'Agrega productos antes de cobrar.';
    const invalid = this.cart.find((item) => {
      const product = this.products.find((p) => p.id === item.productId);
      return !product || !Number.isInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > product.stock;
    });
    return invalid ? 'Revisa ' + invalid.nombre + ': no hay stock suficiente para la cantidad solicitada.' : '';
  }

  //Método para abrir el modal de pago
  protected checkout(): void {
    this.message = this.stockError();
    if (this.message) return;
    this.paymentError = '';
    this.paymentOpen = true;
  }

  //Método para confirmar el pago y guardar la venta
  protected confirmPayment(result: { approved: boolean; method: string }): void {

    if(!this.paymentOpen || !result.approved || !['Efectivo', 'Tarjeta', 'Transferencia'].includes(result.method)) return;

    this.paymentError = this.stockError();

    if(this.paymentError) return;

    const detalles = this.cart.map((item) => ({
      productoId: item.productId,
      cantidad: item.cantidad
    }));

    this.ventaService.registrarVenta({
      usuarioId: 1,
      metodoPago: result.method,
      detalles
    }).subscribe({
      next: (respuesta) => {
        this.ventaService.obtenerVenta(respuesta.id).subscribe({
          next: (venta) => {
            const sale = this.convertirVenta(venta);
            this.cart = [];
            this.paymentOpen = false;
            this.cargarProductos();
            this.cargarVentas();

            void this.router.navigate(['/ventas/ticket'], {
              replaceUrl: true,
              state: {
                salesSession: {
                  products: this.products,
                  sales: [sale, ...this.sales.filter((item) => item.id !== sale.id)],
                  saleId: sale.id
                }
              }
            });
          },
          error: (error) => {
            console.error('Error al consultar la venta registrada: ', error);
            this.paymentError = 'La venta se registró, pero no fue posible consultar el ticket.';
            this.cdr.markForCheck();
          }
        });
      },
      error: (error) => {
        this.paymentError = error.error?.mensaje || 'No fue posible registrar la venta.';
        this.cdr.markForCheck();
      }
    });

  }

  //Método para abrir el detalle de una venta
  protected openDetail(sale: Sale): void {

    this.ventaService.obtenerVenta(sale.id).subscribe({
      next: (venta) => {
        this.selectedSale = this.convertirVenta(venta);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al consultar venta: ', error);
        this.message = 'No fue posible consultar la venta';
        this.cdr.markForCheck();
      }
    });

  }

  //Convierte la respuesta del backend para mostrarla en la pantalla
  private convertirVenta(venta : Venta): Sale {

    return {
      id: venta.id,
      fechaHora: venta.fechaHora,
      items: (venta.detalles ?? []).map((detalle) => ({
        productId: detalle.productoId,
        nombre: detalle.nombre,
        precio: Number(detalle.precioUnitario),
        cantidad: detalle.cantidad
      })),
      subtotal: Number(venta.subtotal),
      iva: Number(venta.iva),
      total: Number(venta.total),
      metodoPago: venta.metodoPago || '',
      referencia: venta.numeroVenta,
      usuario: venta.usuario
    };

  }

}
