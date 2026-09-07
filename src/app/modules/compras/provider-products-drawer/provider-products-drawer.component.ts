import { afterNextRender, Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Provider, Product, ProviderProduct } from '../purchases-page/purchases-page.component';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-provider-products-drawer.component',
  styleUrl: './provider-products-drawer.component.css',
  templateUrl: './provider-products-drawer.component.html',
})
export class ProviderProductsDrawerComponent {
  readonly provider = input.required<Provider>();
  readonly products = input.required<readonly Product[]>();
  readonly associations = input.required<readonly ProviderProduct[]>();
  readonly close = output<void>();
  readonly addAssociation = output<{ productoId: number; precioCompra: number }>();
  readonly updatePrice = output<{ productoId: number; precioCompra: number }>();
  readonly removeAssociation = output<number>();
  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;
  protected notice = '';
  protected readonly form = new FormGroup({
    productoId: new FormControl<number | null>(null, Validators.required),
    precioCompra: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01), Validators.max(1000000), Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
  });
  constructor() {
    afterNextRender(() => this.dialog.nativeElement.showModal());
  }
  protected get associatedProducts() {
    return this.associations().filter((a) => a.proveedorId === this.provider().id).map((a) => ({
      ...a, ...this.products().find((p) => p.id === a.productoId)!,
    }));
  }
  protected get availableProducts() {
    return this.products().filter((p) => !this.associatedProducts.some((a) => a.productoId === p.id));
  }
  protected requestClose(event?: Event): void { event?.preventDefault(); this.close.emit(); }
  protected money(value: number): string { return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value); }
  protected invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }
  protected add(): void {
    this.form.markAllAsTouched();
    const value = this.form.getRawValue();
    if (this.form.invalid || !this.availableProducts.some((p) => p.id === value.productoId)) return;
    this.addAssociation.emit({ productoId: value.productoId!, precioCompra: value.precioCompra! });
    this.form.reset();
    this.notice = 'Producto asociado correctamente.';
  }
  protected savePrice(id: number, price: number): void {
    if (!Number.isFinite(price) || price <= 0 || price > 1000000 || Math.abs(price * 100 - Math.round(price * 100)) >= 0.000001) {
      this.notice = 'Usa un precio mayor que cero, hasta un millón y con máximo dos decimales.';
      return;
    }
    this.updatePrice.emit({ productoId: id, precioCompra: price });
    this.notice = 'Precio vigente actualizado. Las compras confirmadas conservan su precio original.';
  }
  protected remove(id: number): void {
    this.removeAssociation.emit(id);
    this.notice = 'Asociación retirada. El historial de compras se conserva.';
  }
}
