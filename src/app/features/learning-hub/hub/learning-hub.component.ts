import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, NgClass } from '@angular/common';
import { BreadcrumbComponent } from '../../../shared/layouts/main-layout/breadcrumb/breadcrumb.component';
import { LearningHubService } from '../../../core/services/learning-hub.service';
import { GroupService } from '../../../core/services/group.service';
import { StudentLearningPath } from '../../../shared/models/learning-gap.model';
import { Group } from '../../../shared/models/group.model';

@Component({
  selector: 'app-learning-hub',
  standalone: true,
  imports: [FormsModule, DecimalPipe, NgClass, BreadcrumbComponent],
  templateUrl: './learning-hub.html',
  styleUrl: './learning-hub.css',
})
export class LearningHubComponent implements OnInit {
  private hubSvc = inject(LearningHubService);
  private groupSvc = inject(GroupService);

  breadcrumbs = [{ label: 'Rutas de Aprendizaje por Grupo' }];

  groups = signal<Group[]>([]);
  selectedGroupCode = signal<string>('');

  paths = signal<StudentLearningPath[]>([]);
  loading = signal(false);
  error = signal<string>('');

  ngOnInit() {
    this.groupSvc.getMyGroups().subscribe({
      next: (g) => this.groups.set(g),
      error: () => this.error.set('No se pudieron cargar los grupos.')
    });
  }

  fetchData() {
    const code = this.selectedGroupCode();
    if (!code) return;

    this.loading.set(true);
    this.error.set('');
    this.hubSvc.getLearningPathsByGroup(code).subscribe({
      next: (data) => {
        this.paths.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo obtener la ruta de aprendizaje del grupo.');
        this.loading.set(false);
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      IN_PROGRESS: 'En progreso',
      COMPLETED: 'Completado',
      NOT_STARTED: 'Sin iniciar',
    };
    return labels[status] ?? status;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      IN_PROGRESS: 'badge-progress',
      COMPLETED: 'badge-completed',
      NOT_STARTED: 'badge-pending',
    };
    return classes[status] ?? '';
  }
}
