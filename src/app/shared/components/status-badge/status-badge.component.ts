import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadgeComponent {
  // Recibe el estado del backend (ej: 'ACTIVE', 'IN_PROGRESS')
  status = input.required<string>();
  
  customLabel = input<string>('');

  badgeClass = computed(() => {
    const s = this.status().toUpperCase();
    if (s === 'ACTIVE' || s === 'COMPLETED') return 'badge-success';
    if (s === 'IN_PROGRESS') return 'badge-warning';
    if (s === 'CRITICAL' || s === 'ERROR') return 'badge-danger';
    if (s === 'AI' || s === 'GENERATED') return 'badge-purple';
    return 'badge-gray'; // Default para PENDING, INACTIVE, etc.
  });

  displayLabel = computed(() => {
    if (this.customLabel()) return this.customLabel();
    
    // Mapeo automático de base de datos a vista de usuario
    const map: Record<string, string> = {
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
      COMPLETED: 'Completado',
      IN_PROGRESS: 'En progreso',
      PENDING: 'Pendiente',
      CRITICAL: 'Riesgo',
      AI: 'Generado con IA'
    };
    return map[this.status().toUpperCase()] || this.status();
  });
}