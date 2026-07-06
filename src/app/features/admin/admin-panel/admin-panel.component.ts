import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AdminService, PendingUser } from '../../../core/services/admin.service';

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [FormsModule, DatePipe],
    templateUrl: './admin-panel.html',
    styleUrl: './admin-panel.css',
})
export class AdminPanelComponent implements OnInit {
    private auth = inject(AuthService);
    private adminSvc = inject(AdminService);
    private router = inject(Router);

    email = '';
    password = '';

    isLoggedIn = signal(false);
    loadingLogin = signal(false);
    loginError = signal('');

    pendingUsers = signal<PendingUser[]>([]);
    loadingData = signal(false);
    toast = signal<{ msg: string, show: boolean }>({ msg: '', show: false });

    ngOnInit() {
        // Si ya hay un token y el usuario es ADMIN, entramos directo
        const user = this.auth.getUser();
        if (this.auth.isLoggedIn() && user?.role === 'ADMIN') {
            this.isLoggedIn.set(true);
            this.loadPending();
        }
    }

    doLogin() {
        this.loginError.set('');
        if (!this.email.trim() || !this.password) {
            this.loginError.set('Completa todos los campos.');
            return;
        }

        this.loadingLogin.set(true);
        this.auth.login(this.email.trim(), this.password).subscribe({
            next: () => {
                const user = this.auth.getUser();
                if (user?.role === 'ADMIN') {
                    this.isLoggedIn.set(true);
                    this.loadPending();
                } else {
                    this.loginError.set('Solo los administradores pueden acceder a este panel.');
                    this.auth.logout(); // Cerramos sesión si no es admin
                }
                this.loadingLogin.set(false);
            },
            error: () => {
                this.loginError.set('Credenciales incorrectas o servidor no disponible.');
                this.loadingLogin.set(false);
            }
        });
    }

    loadPending() {
        this.loadingData.set(true);
            this.adminSvc.getPendingUsers().subscribe({
                next: (data: PendingUser[]) => {
                    this.pendingUsers.set(data || []);
                    this.loadingData.set(false);
                },
            error: () => {
                this.showToast('Error al cargar las solicitudes');
                this.loadingData.set(false);
            }
        });
    }

    approve(id: number) {
        if (!confirm('¿Aprobar esta cuenta? Se enviará el token JWT al correo.')) return;
        this.adminSvc.approveUser(id).subscribe({
            next: () => {
                this.pendingUsers.update(users => users.filter(u => u.id !== id));
                this.showToast('✔ Cuenta aprobada. Token enviado al docente.');
            },
            error: () => this.showToast('Error al aprobar la cuenta.')
        });
    }

    reject(id: number) {
        if (!confirm('¿Rechazar esta solicitud?')) return;
        this.adminSvc.rejectUser(id).subscribe({
            next: () => {
                this.pendingUsers.update(users => users.filter(u => u.id !== id));
                this.showToast('✖ Solicitud rechazada.');
            },
            error: () => this.showToast('Error al rechazar la solicitud.')
        });
    }

    logout() {
        this.auth.logout();
        this.isLoggedIn.set(false);
        this.email = '';
        this.password = '';
    }

    showToast(msg: string) {
        this.toast.set({ msg, show: true });
        setTimeout(() => this.toast.set({ msg: '', show: false }), 3500);
    }
}