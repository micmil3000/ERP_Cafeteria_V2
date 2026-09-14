import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Proveedor } from '../../../models/proveedor.model';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-provider-form.component',
  styleUrl: './provider-form.component.css',
  templateUrl: './provider-form.component.html',
})

//Componente reutilizable para crear o editar un proveedor
export class ProviderFormComponent implements OnInit {
  //Datos que recibe el componente para definir el modo de operación y el posible proveedor a editar
  readonly mode = input<'CREATE' | 'EDIT'>('CREATE');
  readonly provider = input<Proveedor | null>(null);
  //Eventos que emite el componente al guardar o cancelar la operación
  readonly save = output<Omit<Proveedor, 'id' | 'estado'>>();
  readonly cancel = output<void>();

  //Formulario reactivo con los campos y validaciones necesarias
  protected readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    telefono: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    correo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    direccion: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
  });

  //Carga los datos del proveedor si está en modo EDITAR una vez que el componente se inicializa
  ngOnInit(): void {
    const p = this.provider();
    if (this.mode() === 'EDIT' && p) this.form.patchValue(p);
  }

  //Método que verifica si un campo del formulario esinválido después que el usuario lo haya tocado
  protected invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  //Método ejecutado al enviar el formulario, que valida los datos y emite evento de guardado si son correctos
  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.save.emit({ nombre: v.nombre.trim(), telefono: v.telefono.trim(), correo: v.correo.trim(), direccion: v.direccion.trim() });
  }
}
