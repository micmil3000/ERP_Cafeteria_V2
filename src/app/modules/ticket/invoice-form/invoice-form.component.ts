import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Sale } from '../../ventas/sales-page/sales-page.component';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-invoice-form.component',
  styleUrl: './invoice-form.component.css',
  templateUrl: './invoice-form.component.html',
})
export class InvoiceFormComponent {
  readonly sale = input.required<Sale>();
  readonly save = output<Omit<NonNullable<Sale['factura']>, 'xml'>>();
  readonly cancel = output<void>();
  protected readonly form = new FormGroup({
    rfc: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    codigoPostal: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{5}$/)] }),
    regimen: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    uso: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
  });


  protected invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

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
