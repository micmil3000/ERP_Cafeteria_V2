import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Employee } from '../human-resources-page/human-resources-page.component';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-employee-form',
  styleUrl: './employee-form.component.css',
  templateUrl: './employee-form.component.html',
})
export class EmployeeFormComponent implements OnInit {
  readonly employee = input<Employee | null>(null);
  readonly save = output<Omit<Employee, 'id' | 'estado'>>();
  readonly cancel = output<void>();
  protected readonly fields = [
    { key: 'nombre', label: 'Nombre', type: 'text', error: 'Escribe el nombre.' },
    { key: 'apellidos', label: 'Apellidos', type: 'text', error: 'Escribe los apellidos.' },
    { key: 'telefono', label: 'Teléfono', type: 'tel', error: 'Escribe el teléfono.' },
    { key: 'correo', label: 'Correo', type: 'email', error: 'Escribe un correo válido.' },
    { key: 'fechaContratacion', label: 'Fecha de contratación', type: 'date', error: 'Selecciona la fecha de contratación.' },
  ] as const;
  protected readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    apellidos: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    telefono: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    correo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    fechaContratacion: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    salario: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01), Validators.max(1000000), Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
  });
  ngOnInit(): void { const e = this.employee(); if (e) this.form.patchValue(e); }
  protected invalid(key: keyof typeof this.form.controls): boolean { return this.form.controls[key].touched && this.form.controls[key].invalid; }
  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.save.emit({ ...value, nombre: value.nombre.trim(), apellidos: value.apellidos.trim(), telefono: value.telefono.trim(), correo: value.correo.trim(), salario: Math.round(value.salario! * 100) / 100 });
  }
}
