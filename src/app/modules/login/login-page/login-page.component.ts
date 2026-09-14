import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { Router } from '@angular/router';

import { LoginFormComponent } from '../login-form/login-form.component';

import { Login } from '../../../models/usuario.model';

import { UsuarioService } from '../../../services/usuario.service';

@Component({
  imports: [LoginFormComponent],
  selector: 'app-login-page',
  styleUrl: './login-page.component.css',
  templateUrl: './login-page.component.html'
})

export class LoginPageComponent {

  //Variables para controlar la navegación y los errores
  private readonly router = inject(Router);
  private readonly usuarioService = inject(UsuarioService);
  private readonly cdr = inject(ChangeDetectorRef);
  protected error = '';

  //Método para iniciar sesión desde el backend
  protected login(credentials : Login): void {

    const datos : Login = {
      ...credentials,
      correo: credentials.correo.trim().toLowerCase()
    };

    this.usuarioService.login(datos).subscribe({
      next: () => {
        this.error = '';
        void this.router.navigate(['/inicio']);
      },
      error: () => {
        this.error = 'Correo o contraseña incorrectos.';
        this.cdr.markForCheck();
      }
    });

  }

}
