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
  //Eventos para emitir si el usuario guarda o cancela un gasto
  readonly save = output<ExpenseFormValue>();
  readonly cancel = output<void>();

  //Variables definidas para posibles categorías y métodos de pago
  protected readonly categories = ['Compras', 'Salarios', 'Servicios', 'Renta', 'Mantenimiento', 'Limpieza', 'Publicidad', 'Otros'];
  protected readonly paymentMethods = ['Efectivo', 'Tarjeta', 'Transferencia'];

  //Formulario reactivo con los campos definidos y validaciones
  protected readonly form = new FormGroup({
    fecha: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    concepto: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    categoria: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    subtotal: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01), Validators.max(999999999.99), Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    metodoPago: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    observaciones: new FormControl('', { nonNullable: true }),
  });

  // Obtiene el subtotal convertido a centavos para realizar cálculos más precisos.
  protected get subtotalCents(): number {
    const value = this.form.controls.subtotal.value;
    return value !== null && Number.isFinite(value) && value > 0 ? Math.round(value * 100) : 0;
  }

  // Calcula el IVA del 16% sobre el subtotal en centavos.
  protected get ivaCents(): number {
    return Math.round(this.subtotalCents * 0.16);
  }

  //Devuelve el valor del precio en formato de moneda mexicana
  protected money(cents: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cents / 100);
  }

  //Validación de los campos del formulario sean válidos después de haber sido tocados por el usuario
  protected invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  //Método para guardar un gasto si todos los datos ingresados son válidos
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
