import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login-form',
  styleUrl: './login-form.component.css',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  readonly error = input('');
  readonly submitLogin = output<{ correo: string; password: string }>();
  protected readonly form = new FormGroup({
    correo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  protected invalid(field: keyof typeof this.form.controls): boolean {
    return this.form.controls[field].touched && this.form.controls[field].invalid;
  }
  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) this.submitLogin.emit(this.form.getRawValue());
  }
}
