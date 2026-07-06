import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css']
})
export class VerifyCodeComponent implements OnInit {
  private adminSvc = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tokenSvc = inject(TokenService);

  // Campos del formulario
  code = signal('');
  email = signal('');

  // Estado de la UI
  loading = signal(false);
  success = signal(false);
  errorMsg = signal('');
  attempts = signal(0);
  maxAttempts = 3;

  // Para controlar la redirección después de éxito
  redirectCountdown = signal(5);

  ngOnInit(): void {
    // Obtener email de los query params
    this.email.set(this.route.snapshot.queryParamMap.get('email') || '');

    // Si no hay email, redirigir al login
    if (!this.email()) {
      this.router.navigate(['/login']);
    }

    // Limpiar cualquier token previo por seguridad
    this.tokenSvc.clear();
  }

  verifyCode(): void {
    const codeValue = this.code().trim();
    if (!codeValue || codeValue.length !== 6) {
      this.errorMsg.set('El código debe tener exactamente 6 dígitos.');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    this.adminSvc.verifyCode(this.email(), codeValue).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        this.errorMsg.set('');

        // Iniciar cuenta regresiva para redirigir al login
        let countdown = 5;
        this.redirectCountdown.set(countdown);
        const interval = setInterval(() => {
          countdown--;
          this.redirectCountdown.set(countdown);
          if (countdown <= 0) {
            clearInterval(interval);
            this.router.navigate(['/login']);
          }
        }, 1000);
      },
      error: (err) => {
        this.loading.set(false);
        this.attempts.update(a => a + 1);

        // Extraer mensaje del error del backend
        let message = err?.error?.message || 'Código incorrecto. Inténtalo de nuevo.';
        
        // Manejar casos específicos
        if (err?.error?.message?.includes('máximo de intentos') || this.attempts() >= this.maxAttempts) {
          message = 'Has superado el número máximo de intentos. Serás redirigido al registro.';
          setTimeout(() => {
            this.router.navigate(['/register']);
          }, 3000);
        } else {
          const remaining = this.maxAttempts - this.attempts();
          message = `Código incorrecto. Te quedan ${remaining} intento${remaining > 1 ? 's' : ''}.`;
        }

        this.errorMsg.set(message);
      }
    });
  }

  resendCode(): void {
    // Aquí podrías implementar la re-entrega del código
    // Por ahora, redirigimos al registro para solicitar nuevo código
    this.router.navigate(['/register']);
  }
}