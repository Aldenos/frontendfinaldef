import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CustomValidators } from '../../../shared/validators/custom-validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  step = signal<1 | 2>(1); // 1: Formulario, 2: Mensaje de éxito
  loading = signal(false);
  serverError = signal('');
  role = signal<'DOCENTE' | 'ESTUDIANTE'>('ESTUDIANTE');

  toggleRole(): void {
    this.role.set(this.role() === 'DOCENTE' ? 'ESTUDIANTE' : 'DOCENTE');
  }

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, CustomValidators.notOnlyWhitespace()]],
    lastName: ['', [Validators.required, CustomValidators.notOnlyWhitespace()]],
    email: ['', [Validators.required, CustomValidators.upcEmail()]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: CustomValidators.matchPasswords('password', 'confirmPassword')
  });

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.serverError.set('');

    const formValues = this.registerForm.getRawValue();
    
    // Armamos el DTO según lo que espera el Backend
    const dto = {
      firstName: formValues.firstName!.trim(),
      lastName: formValues.lastName!.trim(),
      email: formValues.email!.trim().toLowerCase(),
      password: formValues.password!,
      roleName: this.role()
    };

    this.auth.register(dto).subscribe({
      next: () => {
        this.loading.set(false);
        this.step.set(2); // Muestra pantalla de éxito
      },
      error: (e) => {
        let msg = 'Error al registrar. Intenta nuevamente.';
        try {
          const parsed = typeof e.error === 'string' ? JSON.parse(e.error) : e.error;
          if (parsed?.message) msg = parsed.message;
        } catch {}
        this.serverError.set(msg);
        this.loading.set(false);
      }
    });
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }
}