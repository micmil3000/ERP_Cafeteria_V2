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
  //Datos que recibe para indicar el modo del formulario y el producto en caso de que sea modo "nueva versión"
  readonly mode = input<'CREATE' | 'NEW_VERSION'>('CREATE');
  readonly product = input<Product | null>(null);
  //Eventos que emite al guardar o cancelar
  readonly save = output<Omit<Product, 'id' | 'estado'>>();
  readonly cancel = output<void>();
  //Categorías disponibles para los productos
  protected readonly categories = ['Cafés', 'Bebidas frías', 'Tés', 'Panadería', 'Postres'];
  //Formulario reactivo con todos los campos y validaciones
  protected readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    categoria: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    precioVenta: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01), Validators.max(999999999.99), Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    stockActual: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(999999999), Validators.pattern(/^\d+$/)]),
    stockMinimo: new FormControl<number | null>(null, [Validators.required, Validators.min(0), Validators.max(999999999), Validators.pattern(/^\d+$/)]),
    descripcion: new FormControl('', { nonNullable: true }),
    imagen: new FormControl('', { nonNullable: true, validators: [Validators.pattern(/^(https?:\/\/[^\s]+|\/?[\w.-]+(?:\/[^\s:]*)?)$/)] }),
  });

  //Método para que cuando se inicialice el componente en caso sea el modo de nueva versión y haya recibido un producto rellene los campos con esos datos
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

  //Método para validar si un campo es inválido después de que fue tocado
  protected invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  //Método para guardar lo enviado en el fomrulario después de revisar que todos los cmapos son válidos
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
