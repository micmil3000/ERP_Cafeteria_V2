import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Product } from '../inventory-page/inventory-page.component';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-product-form',
  styleUrl: './product-form.component.css',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  readonly mode = input<'CREATE' | 'NEW_VERSION'>('CREATE');
  readonly product = input<Product | null>(null);
  readonly save = output<Omit<Product, 'id' | 'estado'>>();
  readonly cancel = output<void>();
  protected readonly categories = ['Cafés', 'Bebidas frías', 'Tés', 'Panadería', 'Postres'];
  protected readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    categoria: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    precioVenta: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01), Validators.max(999999999.99), Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    stockActual: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(999999999), Validators.pattern(/^\d+$/)]),
    stockMinimo: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(999999999), Validators.pattern(/^\d+$/)]),
    descripcion: new FormControl('', { nonNullable: true }),
    imagen: new FormControl('', { nonNullable: true, validators: [Validators.pattern(/^(https?:\/\/[^\s]+|\/?[\w.-]+(?:\/[^\s:]*)?)$/)] }),
  });

  ngOnInit(): void {
    const product = this.product();
    if (this.mode() === 'NEW_VERSION' && product) {
      this.form.patchValue({
        nombre: product.nombre, categoria: product.categoria, precioVenta: product.precioVenta,
        stockActual: product.stockActual, stockMinimo: product.stockMinimo,
        descripcion: product.descripcion, imagen: product.imagen,
      });
    }
  }

  protected invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || (this.mode() === 'NEW_VERSION' && !this.product())) return;
    const value = this.form.getRawValue();
    this.save.emit({
      ...value,
      nombre: value.nombre.trim(),
      precioVenta: Math.round(value.precioVenta! * 100) / 100,
      stockActual: this.mode() === 'NEW_VERSION' ? this.product()!.stockActual : value.stockActual!,
      stockMinimo: value.stockMinimo!,
      descripcion: value.descripcion.trim(),
      imagen: value.imagen.trim(),
    });
  }
}
