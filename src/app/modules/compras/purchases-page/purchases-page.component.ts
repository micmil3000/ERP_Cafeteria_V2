import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

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

import { Proveedor } from '../../../models/proveedor.model';

import { Producto } from '../../../models/producto.model';

import { Compra, DetalleCompra, NuevaCompra } from '../../../models/compra.model';

import { ProductoService } from '../../../services/producto.service';

import { ProductoProveedorDetalle, ProveedorService } from '../../../services/proveedor.service';

import { CompraService } from '../../../services/compra.service';

@Component({
  imports: [FormsModule, PageHeaderComponent, TabsComponent, BadgeComponent, DataTableComponent, ModalComponent,
    ConfirmDialogComponent, ProviderFormComponent, ProviderProductsDrawerComponent, PurchaseDetailModalComponent],
  selector: 'app-purchases-page.component',
  styleUrl: './purchases-page.component.css',
  templateUrl: './purchases-page.component.html',
})

export class PurchasesPageComponent implements OnInit {

  //Variables para manejar las funcionalidades de compras y proveedores
  protected readonly currentRole: 'GERENTE' | 'TRABAJADOR' = 'GERENTE';
  protected readonly tabs = [{ id: 'purchases', label: 'Compras' }, { id: 'providers', label: 'Proveedores' }];
  protected activeTab = 'purchases';
  protected purchaseView = 'new';
  protected search = '';
  protected selectedProviderId : number | null = null;
  protected cart : { productoProveedorId : number; productoId : number; cantidad : number }[] = [];
  protected providerFormOpen = false;
  protected editingProvider : Proveedor | null = null;
  protected drawerProviderId : number | null = null;
  protected pendingDeactivation : Proveedor | null = null;
  protected confirmingPurchase = false;
  protected selectedPurchase : Compra | null = null;
  protected notice = '';

  //Datos cargados desde el backend
  protected providers : Proveedor[] = [];
  protected products : Producto[] = [];
  protected associations : ProductoProveedorDetalle[] = [];
  protected purchases : Compra[] = [];

  constructor(
    private proveedorService : ProveedorService,
    private productoService : ProductoService,
    private compraService : CompraService,
    private cdr : ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.cargarProveedores();
    this.cargarProductos();
    this.cargarCompras();

  }

  //Carga los proveedores desde el backend
  private cargarProveedores(): void {

    this.proveedorService.obtenerProveedores().subscribe({
      next: (proveedores) => {
        this.providers = proveedores;
        this.cargarTodasLasAsociaciones();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar proveedores: ', error);
        this.notice = 'No fue posible cargar los proveedores';
        this.cdr.markForCheck();
      }
    });

  }

  //Carga los productos generales desde el backend
  private cargarProductos(): void {

    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        this.products = productos;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar productos: ', error);
        this.notice = 'No fue posible cargar los productos';
        this.cdr.markForCheck();
      }
    });

  }

  //Carga el historial de compras
  private cargarCompras(): void {

    this.compraService.obtenerCompras().subscribe({
      next: (compras) => {
        this.purchases = compras;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar compras: ', error);
        this.notice = 'No fue posible cargar las compras';
        this.cdr.markForCheck();
      }
    });

  }

  //Carga las relaciones de productos de cada proveedor
  private cargarTodasLasAsociaciones(): void {

    this.associations = [];

    this.providers.forEach((proveedor) => {
      this.proveedorService.obtenerProductos(proveedor.id).subscribe({
        next: (productos) => {
          this.associations = [
            ...this.associations.filter((producto) => producto.proveedorId !== proveedor.id),
            ...productos
          ];
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error al cargar productos del proveedor: ', error);
        }
      });
    });

  }

  protected get activeProviders() : Proveedor[] {
    return this.providers.filter((proveedor) => proveedor.estado === 'ACTIVO');
  }

  protected get filteredProviders() : Proveedor[] {
    const query = this.search.trim().toLocaleLowerCase('es-MX');
    return this.providers.filter((proveedor) => proveedor.nombre.toLocaleLowerCase('es-MX').includes(query));
  }

  protected get drawerProvider() : Proveedor | undefined {
    return this.providers.find((proveedor) => proveedor.id === this.drawerProviderId);
  }

  protected get availableProducts() : ProductoProveedorDetalle[] {
    return this.associations.filter((producto) => producto.proveedorId === this.selectedProviderId);
  }

  protected get lines() : DetalleCompra[] {

    return this.cart.map((linea) => {
      const relacion = this.associations.find((producto) => producto.id === linea.productoProveedorId);

      return {
        id: relacion?.id ?? 0,
        productoId: linea.productoId,
        nombre: relacion?.nombre ?? 'Producto no disponible',
        cantidad: linea.cantidad,
        precioCompra: Number(relacion?.precioCompra ?? 0),
        subtotal: Number(relacion?.precioCompra ?? 0) * linea.cantidad
      };
    });

  }

  protected get subtotal() : number {
    return this.lines.reduce((total, linea) => total + Math.round(linea.precioCompra * 100) * linea.cantidad, 0) / 100;
  }

  protected get iva() : number {
    return Math.round(Math.round(this.subtotal * 100) * 0.16) / 100;
  }

  protected get total() : number {
    return (Math.round(this.subtotal * 100) + Math.round(this.iva * 100)) / 100;
  }

  protected get canConfirm() : boolean {
    return this.currentRole === 'GERENTE' && this.selectedProviderId !== null && this.cart.length > 0 &&
      this.cart.every((linea) => Number.isInteger(linea.cantidad) && linea.cantidad > 0 && linea.cantidad <= 1000000);
  }

  protected associationCount(proveedorId : number) : number {
    return this.associations.filter((producto) => producto.proveedorId === proveedorId).length;
  }

  protected money(value : number) : string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  protected date(value : string) : string {
    return new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Mexico_City' }).format(new Date(value));
  }

  //Método para abrir el modal de agregar o editar proveedor
  protected openProvider(proveedor : Proveedor | null = null): void {
    this.editingProvider = proveedor;
    this.providerFormOpen = true;
  }

  //Método para guardar un nuevo proveedor o sus cambios
  protected saveProvider(proveedor : Omit<Proveedor, 'id' | 'estado'>): void {

    const solicitud = this.editingProvider
      ? this.proveedorService.editarProveedor(this.editingProvider.id, proveedor)
      : this.proveedorService.registrarProveedor(proveedor);

    solicitud.subscribe({
      next: () => {
        this.providerFormOpen = false;
        this.editingProvider = null;
        this.notice = 'Proveedor guardado correctamente.';
        this.cargarProveedores();
      },
      error: (error) => {
        console.error('Error al guardar proveedor: ', error);
        this.notice = 'No fue posible guardar el proveedor';
        this.cdr.markForCheck();
      }
    });

  }

  //Método para "eliminar" o desactivar un proveedor
  protected deactivateProvider(): void {

    if(!this.pendingDeactivation) return;

    this.proveedorService.desactivarProveedor(this.pendingDeactivation.id).subscribe({
      next: () => {
        this.pendingDeactivation = null;
        this.selectedProviderId = null;
        this.cart = [];
        this.notice = 'Proveedor desactivado. Se conserva para consulta.';
        this.cargarProveedores();
      },
      error: (error) => {
        console.error('Error al desactivar proveedor: ', error);
        this.notice = 'No fue posible desactivar el proveedor';
        this.cdr.markForCheck();
      }
    });

  }

  //Método para agregar un producto asociado al proveedor
  protected addAssociation(value : { productoId : number; precioCompra : number }): void {

    if(this.drawerProviderId === null) return;

    this.proveedorService.registrarProducto(this.drawerProviderId, value).subscribe({
      next: () => {
        this.notice = 'Producto asociado correctamente.';
        this.cargarProveedores();
      },
      error: (error) => {
        console.error('Error al asociar producto: ', error);
        this.notice = 'No fue posible asociar el producto';
        this.cdr.markForCheck();
      }
    });

  }

  //Método para actualizar el precio del producto
  protected updatePrice(value : { productoId : number; precioCompra : number }): void {

    if(this.drawerProviderId === null) return;

    const relacion = this.associations.find((producto) =>
      producto.proveedorId === this.drawerProviderId && producto.productoId === value.productoId
    );

    if(!relacion) return;

    this.proveedorService.actualizarPrecio(this.drawerProviderId, relacion.id, value.precioCompra).subscribe({
      next: () => {
        this.notice = 'Precio actualizado correctamente.';
        this.cargarProveedores();
      },
      error: (error) => {
        console.error('Error al actualizar precio: ', error);
        this.notice = 'No fue posible actualizar el precio';
        this.cdr.markForCheck();
      }
    });

  }

  //Método para eliminar la relación de un producto
  protected removeAssociation(productoId : number): void {

    if(this.drawerProviderId === null) return;

    const relacion = this.associations.find((producto) =>
      producto.proveedorId === this.drawerProviderId && producto.productoId === productoId
    );

    if(!relacion) return;

    this.proveedorService.eliminarProducto(this.drawerProviderId, relacion.id).subscribe({
      next: () => {
        this.notice = 'Relación eliminada correctamente.';
        this.removeLine(productoId);
        this.cargarProveedores();
      },
      error: (error) => {
        console.error('Error al eliminar relación: ', error);
        this.notice = 'No fue posible eliminar la relación';
        this.cdr.markForCheck();
      }
    });

  }

  protected changeProvider(id : number | null): void {
    this.selectedProviderId = id;
    this.cart = [];
  }

  //Método para agregar un producto a la compra
  protected addProduct(productoId : number): void {

    const relacion = this.availableProducts.find((producto) => producto.productoId === productoId);

    if(!relacion) return;

    const linea = this.cart.find((producto) => producto.productoProveedorId === relacion.id);

    if(linea) {
      this.setQuantity(productoId, linea.cantidad + 1);
      return;
    }

    this.cart = [...this.cart, {
      productoProveedorId: relacion.id,
      productoId: relacion.productoId,
      cantidad: 1
    }];

  }

  protected setQuantity(productoId : number, cantidad : number | null): void {
    this.cart = this.cart.map((linea) => linea.productoId === productoId ? { ...linea, cantidad: cantidad ?? 0 } : linea);
  }

  protected removeLine(productoId : number): void {
    this.cart = this.cart.filter((linea) => linea.productoId !== productoId);
  }

  protected requestConfirmation(): void {
    if(this.canConfirm) this.confirmingPurchase = true;
  }

  //Método para confirmar y registrar la compra
  protected confirmPurchase(): void {

    if(!this.confirmingPurchase || !this.canConfirm || this.selectedProviderId === null) {
      this.confirmingPurchase = false;
      return;
    }

    const compra : NuevaCompra = {
      proveedorId: this.selectedProviderId,
      usuarioId: 1,
      metodoPago: null,
      detalles: this.cart.map((linea) => ({
        productoProveedorId: linea.productoProveedorId,
        cantidad: linea.cantidad
      }))
    };

    this.compraService.registrarCompra(compra).subscribe({
      next: (respuesta) => {
        this.cart = [];
        this.selectedProviderId = null;
        this.confirmingPurchase = false;
        this.notice = 'Compra #' + respuesta.id + ' registrada correctamente.';
        this.purchaseView = 'history';
        this.cargarCompras();
        this.cargarProductos();
      },
      error: (error) => {
        console.error('Error al registrar compra: ', error);
        this.confirmingPurchase = false;
        this.notice = 'No fue posible registrar la compra';
        this.cdr.markForCheck();
      }
    });

  }

  //Consulta el detalle de una compra
  protected openPurchaseDetail(compra : Compra): void {

    this.compraService.obtenerCompraPorId(compra.id).subscribe({
      next: (detalle) => {
        this.selectedPurchase = detalle;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al consultar compra: ', error);
        this.notice = 'No fue posible consultar la compra';
        this.cdr.markForCheck();
      }
    });

  }

}
