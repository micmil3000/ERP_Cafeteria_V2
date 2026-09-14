import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VentaVista as Sale } from '../../../models/venta.model';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-invoice-form.component',
  styleUrl: './invoice-form.component.css',
  templateUrl: './invoice-form.component.html',
})
export class InvoiceFormComponent {
  //Variables para recibir la venta y controlar las acciones
  readonly sale = input.required<Sale>();
  readonly save = output<Omit<NonNullable<Sale['factura']>, 'xml'>>();
  readonly cancel = output<void>();
  //Formulario con los datos fiscales y sus validaciones
  protected readonly form = new FormGroup({
    rfc: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    codigoPostal: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{5}$/)] }),
    regimen: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    uso: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
  });


  //Método para identificar campos inválidos
  protected invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  //Devuelve valor de dinero en moneda mexicana
  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  //Método para enviar los datos de la factura
  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.sale().factura) return;
    const value = this.form.getRawValue();
    this.save.emit({
      rfc: value.rfc.trim().toUpperCase(), nombre: value.nombre.trim(),
      codigoPostal: value.codigoPostal.trim(), regimen: value.regimen.trim(), uso: value.uso.trim(),
    });
  }
}
