import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  imports: [LoginFormComponent],
  selector: 'app-login-page',
  styleUrl: './login-page.component.css',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private readonly router = inject(Router);
  private readonly users = [
    { correo: 'gerente@savia.com', password: '1234' },
    { correo: 'trabajador@savia.com', password: '1234' },
  ];
  protected error = '';
  protected login(credentials: { correo: string; password: string }): void {
    if (this.users.some((u) => u.correo === credentials.correo.trim().toLowerCase() && u.password === credentials.password)) {
      this.error = '';
      void this.router.navigate(['/inicio']);
    } else {
      this.error = 'Correo o contraseña incorrectos.';
    }
  }
}
