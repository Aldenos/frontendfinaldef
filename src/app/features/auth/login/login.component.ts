import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = signal(false);
  errorMsg = signal('');

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const { email, password } = this.loginForm.getRawValue();

    this.auth.login(email, password).subscribe({
      next: (res) => {
        if (res.user.status === 'PENDING') {
          this.errorMsg.set('Tu cuenta está pendiente de aprobación por un administrador.');
          this.auth.logout();
        } else {
          const role = res.user.roleName;
          if (role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else if (role === 'DOCENTE') {
            this.router.navigate(['/docentes/dashboard']);
          } else if (role === 'ESTUDIANTE') {
            this.router.navigate(['/estudiantes/dashboard']);
          } else {
            this.router.navigate(['/login']);
          }
        }
        this.loading.set(false);
      },
      error: (e) => {
        this.errorMsg.set(e?.error?.message || 'Correo o contraseña incorrectos.');
        this.loading.set(false);
      }
    });
  }
}