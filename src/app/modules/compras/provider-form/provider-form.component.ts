import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Provider } from '../purchases-page/purchases-page.component';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-provider-form.component',
  styleUrl: './provider-form.component.css',
  templateUrl: './provider-form.component.html',
})
export class ProviderFormComponent implements OnInit {
  readonly mode = input<'CREATE' | 'EDIT'>('CREATE');
  readonly provider = input<Provider | null>(null);
  readonly save = output<Omit<Provider, 'id' | 'estado'>>();
  readonly cancel = output<void>();
  protected readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    contacto: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    telefono: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    correo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    direccion: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
  });
  ngOnInit(): void {
    const p = this.provider();
    if (this.mode() === 'EDIT' && p) this.form.patchValue(p);
  }
  protected invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }
  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.save.emit({ nombre: v.nombre.trim(), contacto: v.contacto.trim(), telefono: v.telefono.trim(), correo: v.correo.trim(), direccion: v.direccion.trim() });
  }
}
