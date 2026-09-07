import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface ExpenseFormValue {
  fecha: string;
  concepto: string;
  categoria: string;
  subtotal: number;
  metodoPago: string;
  observaciones: string;
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-expense-form',
  styleUrl: './expense-form.component.css',
  templateUrl: './expense-form.component.html',
})
export class ExpenseFormComponent {
  readonly save = output<ExpenseFormValue>();
  readonly cancel = output<void>();
  protected readonly categories = ['Compras', 'Salarios', 'Servicios', 'Renta', 'Mantenimiento', 'Limpieza', 'Publicidad', 'Otros'];
  protected readonly paymentMethods = ['Efectivo', 'Tarjeta', 'Transferencia'];
  protected readonly form = new FormGroup({
    fecha: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    concepto: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    categoria: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    subtotal: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01), Validators.max(999999999.99), Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    metodoPago: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    observaciones: new FormControl('', { nonNullable: true }),
  });

  protected get subtotalCents(): number {
    const value = this.form.controls.subtotal.value;
    return value !== null && Number.isFinite(value) && value > 0 ? Math.round(value * 100) : 0;
  }

  protected get ivaCents(): number {
    return Math.round(this.subtotalCents * 0.16);
  }

  protected money(cents: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cents / 100);
  }

  protected invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.save.emit({
      ...value,
      concepto: value.concepto.trim(),
      subtotal: this.subtotalCents / 100,
      observaciones: value.observaciones.trim(),
    });
  }
}
