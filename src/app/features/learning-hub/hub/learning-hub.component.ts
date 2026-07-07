import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BreadcrumbComponent } from '../../../shared/layouts/main-layout/breadcrumb/breadcrumb.component';
import { LearningHubService, GroupStatistic, SubTopicGap } from '../../../core/services/learning-hub.service';
import { GroupService } from '../../../core/services/group.service';
import { TopicService } from '../../../core/services/topic.service';
import { StudentLearningPath } from '../../../shared/models/learning-gap.model';
import { Group } from '../../../shared/models/group.model';

type Estado = 'Crítico' | 'Bajo' | 'Óptimo';

interface TopicGapRow {
  topicName: string;
  topicId: number | null;
  averageMastery: number;
  estado: Estado;
  subtopics: SubTopicGap[];
}

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
  private topicSvc = inject(TopicService);
  private router = inject(Router);

  breadcrumbs = [{ label: 'Rutas de Aprendizaje por Grupo' }];

  groups = signal<Group[]>([]);
  selectedGroupCode = signal<string>('');

  paths = signal<StudentLearningPath[]>([]);
  loading = signal(false);
  error = signal<string>('');

  topicGaps = signal<TopicGapRow[]>([]);
  topicGapsError = signal<string>('');
  expandedTopic = signal<string | null>(null);

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

    this.fetchTopicGaps(code);
  }

  private fetchTopicGaps(code: string): void {
    this.topicGapsError.set('');
    this.topicGaps.set([]);

    const group = this.groups().find(g => g.code === code);
    const collectionName = group?.collectionName;
    if (!collectionName) {
      this.topicGapsError.set('Este grupo no está vinculado a ninguna colección.');
      return;
    }

    forkJoin({
      groupStats: this.hubSvc.getGroupsStatistics(collectionName).pipe(catchError(() => of([] as GroupStatistic[]))),
      subtopicGaps: this.hubSvc.getSubTopicGapsByGroup(code).pipe(catchError(() => of([] as SubTopicGap[]))),
      topics: this.topicSvc.getByCollection(collectionName).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ groupStats, subtopicGaps, topics }) => {
        const stat = groupStats.find(s => s.groupCode === code);
        if (!stat || !stat.topicAverageMap) {
          this.topicGaps.set([]);
          return;
        }

        const topicIdByName = new Map<string, number>();
        for (const t of topics) topicIdByName.set(t.name, t.id);

        const subtopicsByTopic = new Map<string, SubTopicGap[]>();
        for (const sg of subtopicGaps) {
          const list = subtopicsByTopic.get(sg.topicName) ?? [];
          list.push(sg);
          subtopicsByTopic.set(sg.topicName, list);
        }

        const rows: TopicGapRow[] = Object.entries(stat.topicAverageMap).map(([topicName, avg]) => ({
          topicName,
          topicId: topicIdByName.get(topicName) ?? null,
          averageMastery: avg,
          estado: this.computeEstado(avg),
          subtopics: subtopicsByTopic.get(topicName) ?? []
        }));

        rows.sort((a, b) => a.averageMastery - b.averageMastery);
        this.topicGaps.set(rows);
      },
      error: () => this.topicGapsError.set('No se pudieron cargar las brechas por tema.')
    });
  }

  private computeEstado(avg: number): Estado {
    if (avg < 50) return 'Crítico';
    if (avg < 70) return 'Bajo';
    return 'Óptimo';
  }

  estadoClass(estado: Estado): string {
    if (estado === 'Crítico') return 'estado-critico';
    if (estado === 'Bajo') return 'estado-bajo';
    return 'estado-optimo';
  }

  toggleTopic(topicName: string): void {
    this.expandedTopic.set(this.expandedTopic() === topicName ? null : topicName);
  }

  goToCreateActivity(row: TopicGapRow): void {
    const group = this.groups().find(g => g.code === this.selectedGroupCode());
    if (!group?.collectionId || !row.topicId) return;
    this.router.navigate(['/docentes/colecciones', group.collectionId, 'temas', row.topicId, 'crear']);
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
