import { afterNextRender, Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Proveedor } from '../../../models/proveedor.model';
import { Producto } from '../../../models/producto.model';
import { ProductoProveedorDetalle } from '../../../services/proveedor.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-provider-products-drawer.component',
  styleUrl: './provider-products-drawer.component.css',
  templateUrl: './provider-products-drawer.component.html',
})

//Componente reutilizable para gestionar los productos relacionados a un proveedor en específico
export class ProviderProductsDrawerComponent {
  //Datos que recibe el componente: proveedor, productos disponibles y asociaciones existentes
  readonly provider = input.required<Proveedor>();
  readonly products = input.required<readonly Producto[]>();
  readonly associations = input.required<readonly ProductoProveedorDetalle[]>();
  //Eventos que emite el componente: cerrar, agregar nuevo producto a ese proveedor, actualiza precio, eliminar producto de ese proveedor
  readonly close = output<void>();
  readonly addAssociation = output<{ productoId: number; precioCompra: number }>();
  readonly updatePrice = output<{ productoId: number; precioCompra: number }>();
  readonly removeAssociation = output<number>();

  //Referencia al elemento del modal para poder abrirlo y cerrarlo
  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;

  //Mensaje de aviso que se muestra al usuario al realizar una acción
  protected notice = '';

  //Formulario reactivo para asociar un nuevo producto al proveedor, con validaciones de campos
  protected readonly form = new FormGroup({
    productoId: new FormControl<number | null>(null, Validators.required),
    precioCompra: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01), Validators.max(1000000), Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
  });

  //Constructor que se ejecuta al crear el componente, abre el modal después de renderizarlo
  constructor() {
    afterNextRender(() => 
      this.dialog.nativeElement.showModal()
  );
  }

  //Obtiene los productos asociados de un único proveedor
  protected get associatedProducts() {
    return this.associations().filter((a) => a.proveedorId === this.provider().id).map((a) => ({
      ...a, ...this.products().find((p) => p.id === a.productoId)!,
    }));
  }

  //Obtiene los productos que dicho proveedor todavía no tiene asociado
  protected get availableProducts() {
    return this.products().filter((p) => !this.associatedProducts.some((a) => a.productoId === p.id));
  }

  //Método que se realiza cuando el usuario quiere cerrar este modal
  protected requestClose(event?: Event): void { 
    event?.preventDefault(); 
    this.close.emit(); 
  }

  //Convierte el valor de precio al formato de moneda mexicana
  protected money(value: number): string { return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value); }

  //Validación de los campos del formulario cuando ya han sido tocados por el usuario
  protected invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }
  //Método para agregar una asociación después de verificar que los datos son correctos
  protected add(): void {
    this.form.markAllAsTouched();
    const value = this.form.getRawValue();
    if (this.form.invalid || !this.availableProducts.some((p) => p.id === value.productoId)) return;
    this.addAssociation.emit({ productoId: value.productoId!, precioCompra: value.precioCompra! });
    this.form.reset();
    this.notice = 'Producto asociado correctamente.';
  }
  //Método para actualizar el nuevo precio de un producto del proveedor después de validar que sean correctos todos los campos
  protected savePrice(id: number, price: number): void {
    if (!Number.isFinite(price) || price <= 0 || price > 1000000 || Math.abs(price * 100 - Math.round(price * 100)) >= 0.000001) {
      this.notice = 'Usa un precio mayor que cero, hasta un millón y con máximo dos decimales.';
      return;
    }
    this.updatePrice.emit({ productoId: id, precioCompra: price });
    this.notice = 'Precio vigente actualizado. Las compras confirmadas conservan su precio original.';
  }
  //Elimina un producto específico de ese proveedor
  protected remove(id: number): void {
    this.removeAssociation.emit(id);
    this.notice = 'Asociación retirada. El historial de compras se conserva.';
  }
}
