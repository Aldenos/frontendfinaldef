import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  userName = computed(() => this.auth.getUser()?.name || 'Docente');
  
  initials = computed(() => {
    const name = this.userName();
    if (name && name !== 'Docente') {
      return name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
    }
    return 'AM'; // Default basado en tu imagen
  });

  logout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }
}