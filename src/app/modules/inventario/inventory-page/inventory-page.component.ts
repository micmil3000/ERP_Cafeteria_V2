import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ProductTableComponent } from '../product-table/product-table.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { Producto } from '../../../models/producto.model';
import { ProductoService } from '../../../services/producto.service';

@Component({
  imports: [FormsModule, PageHeaderComponent, ModalComponent, ConfirmDialogComponent, ProductTableComponent, ProductFormComponent],
  selector: 'app-inventory-page',
  styleUrl: './inventory-page.component.css',
  templateUrl: './inventory-page.component.html',
})

export class inventoryPageComponent implements OnInit {
  //Variable para definir el rol. Para pruebas
  protected readonly currentRole: 'GERENTE' | 'TRABAJADOR' = 'GERENTE'; // Cambiar a 'GERENTE' para habilitar la edición.
  //Variables para manejar categorias, filtros aplicados, formulario de producto, version actual del producto, desactivar producto
  protected readonly categories = ['Cafés', 'Bebidas frías', 'Tés', 'Panadería', 'Postres'];
  protected filters = { search: '', category: '', stock: '', status: '', order: 'AZ' };
  protected formOpen = false;
  protected versionSource: Producto | null = null;
  protected pendingDeactivation: Producto | null = null;
  //Mensaje para notificar al usuario de la acción realizada
  protected notice = '';

  //Productos obtenidos del backend
  protected products : Producto[] = [];

  //Define el acceso del componente al Angular service
  constructor(
    private productoService : ProductoService,
    private cdr : ChangeDetectorRef
  ) {}

  //Cuando Angular inicializa el componente cargar los productos desde el backend
  ngOnInit(): void {
    this.loadProducts();
  }

  //Método para cargar los productos desde el backend
  private loadProducts() : void {
    this.productoService.obtenerProductos().subscribe({
      next: (products) => {
        //Obtiene productos y forza a que se actualice
        this.products = products;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar productos: ', error);
        this.notice = 'No fue posible cargar los productos';
      }
    });
  }
  //Define el estado del stock del producto
  protected stockStatus(product: Producto): string {
    return product.stockActual === 0 ? 'AGOTADO'
      : product.stockActual <= product.stockMinimo ? 'STOCK BAJO' : 'DISPONIBLE';
  }

  //Obtiene productos después de filtrarlos
  protected get filteredProducts(): readonly Producto[] {
    const f = this.filters;
    const search = f.search.trim().toLocaleLowerCase('es-MX');
    return this.products.filter((p) =>
      p.nombre.toLocaleLowerCase('es-MX').includes(search) &&
      (!f.category || p.categoria === f.category) &&
      (!f.stock || this.stockStatus(p) === f.stock) &&
      (!f.status || p.estado === f.status)
    ).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }) * (f.order === 'ZA' ? -1 : 1));
  }

  //Obtiene información para las tarjetas de resumen sobre estado de los productos
  protected get summary() {
    const active = this.products.filter((p) => p.estado === 'ACTIVO');
    return [
      { label: 'Productos activos', value: active.length, tone: 'sage' },
      { label: 'Stock bajo', value: active.filter((p) => this.stockStatus(p) === 'STOCK BAJO').length, tone: 'cinnamon' },
      { label: 'Agotados', value: active.filter((p) => this.stockStatus(p) === 'AGOTADO').length, tone: 'terracotta' },
    ];
  }

  //Limpia los filtros seleccionados
  protected clearFilters(): void {
    this.filters = { search: '', category: '', stock: '', status: '', order: 'AZ' };
  }

  //Abrir el modal para crear un producto, únicamente si es gerente
  protected openCreate(): void {
    if (this.currentRole !== 'GERENTE') return;
    this.versionSource = null;
    this.formOpen = true;
    this.notice = '';
  }

  //Abrir el modal para crear una nueva versión de un producto existente
  protected openVersion(product: Producto): void {
    if (this.currentRole !== 'GERENTE') return;
    this.versionSource = product;
    this.formOpen = true;
    this.notice = '';
  }

  //Método a ejecutar cuando se solicita cerrar un formulario
  protected closeForm(): void {
    this.formOpen = false;
    this.versionSource = null;
  }

  //Método para guardar un producto
  protected saveProduct(value: Omit<Producto, 'id' | 'estado'>): void {
    if (this.currentRole !== 'GERENTE' || !this.formOpen) return;
    
    const source = this.versionSource;
    const product = {
      ...value,
      // Una versión conserva el stock del producto anterior
      stockActual: source 
      ? source.stockActual 
      : value.stockActual,
    };

    if(source){
      this.productoService.crearNuevaVersion(source.id, product).subscribe({
        next: () => {
          this.closeForm();

          this.notice = 'Nueva versión creada. El registro anterior permanece inactivo.';

          this.loadProducts();

          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error al crear nueva versión: ', error);

          this.notice ='No fue posible crear la nueva versión';
        }
      });
      return;
    }

    this.productoService.registrarProducto(product).subscribe({
      next: (respuesta) => {
        console.log('ENTRó AL NEXT', respuesta);

        this.closeForm();

        this.notice = 'Producto registrado correctamente';

        this.loadProducts();

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al registrar producto: ', error);
        this.notice = 'No fue posible registrar el producto';
      }
    });
  }

  //Método para solicitar desactivar un producto
  protected requestDeactivation(product: Producto): void {
    if (this.currentRole === 'GERENTE' && product.estado === 'ACTIVO') {
      this.pendingDeactivation = product;
    }
  }

  //Método para desactivar un producto
  protected deactivate(): void {
    if (this.currentRole !== 'GERENTE' || !this.pendingDeactivation) return;
    const id = this.pendingDeactivation.id;
    
    this.productoService.desactivarProducto(id).subscribe({
      next: () => {
        this.pendingDeactivation = null;

        this.notice = 'Producto desactivado. Puedes consultarlo con el filtro de estado Todos o Inactivo.';

        this.loadProducts();

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al desactivar producto: ', error);

        this.notice = 'No fue posible desactivar el producto';
      }
    });
  }
}
