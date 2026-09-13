import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Employee } from '../human-resources-page/human-resources-page.component';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-salary-payment-form',
  styleUrl: './salary-payment-form.component.css',
  templateUrl: './salary-payment-form.component.html',
})
export class SalaryPaymentFormComponent {
  //Variables para recibir trabajadores y controlar el formulario
  readonly employees = input.required<readonly Employee[]>();
  readonly save = output<{ empleadoId: number; periodo: string }>();
  readonly cancel = output<void>();
  protected readonly form = new FormGroup({
    empleadoId: new FormControl<number | null>(null, Validators.required),
    periodo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
  });
  //Obtiene los trabajadores activos y el trabajador seleccionado
  protected get activeEmployees() { return this.employees().filter((e) => e.estado === 'ACTIVO'); }
  protected get employee() { return this.activeEmployees.find((e) => e.id === this.form.controls.empleadoId.value); }
  //Método para identificar campos inválidos
  protected invalid(key: keyof typeof this.form.controls): boolean { return this.form.controls[key].touched && this.form.controls[key].invalid; }
  //Devuelve valor de dinero en moneda mexicana
  protected money(value: number): string { return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value); }
  //Método para guardar el pago de salario
  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.employee) return;
    this.save.emit({ empleadoId: this.employee.id, periodo: this.form.controls.periodo.value.trim() });
  }
}
