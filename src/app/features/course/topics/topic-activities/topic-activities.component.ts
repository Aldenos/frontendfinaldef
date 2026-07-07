import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivityService } from '../../../../core/services/activity.service';
import { TopicService } from '../../../../core/services/topic.service';
import { Activity } from '../../../../shared/models/activity.model';
import { ActivityCreateModalComponent } from '../../activities/activity-create-modal/activity-create-modal.component';

@Component({
  selector: 'app-topic-activities',
  standalone: true,
  imports: [ActivityCreateModalComponent],
  templateUrl: './topic-activities.html',
  styleUrl: './topic-activities.css',
})
export class TopicActivitiesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private actSvc = inject(ActivityService);
  private topicSvc = inject(TopicService);

  collectionId   = signal(0);
  topicId        = signal(0);
  topicName      = signal('');
  activities     = signal<Activity[]>([]);
  loading        = signal(true);
  error          = signal('');
  showCreateModal = signal(false);

  ngOnInit() {
    this.collectionId.set(Number(this.route.snapshot.paramMap.get('collectionId')));
    this.topicId.set(Number(this.route.snapshot.paramMap.get('topicId')));
    this.loadTopic();
    this.load();
  }

  loadTopic() {
    this.topicSvc.getById(this.topicId()).subscribe({
      next: (t) => this.topicName.set(t.name),
      error: () => this.topicName.set('Tema')
    });
  }

  load() {
    this.loading.set(true);
    forkJoin({
      quizzes: this.actSvc.getByTopic(this.topicId()).pipe(catchError(() => of([] as Activity[]))),
      flashcardSets: this.actSvc.getFlashcardSetsByTopic(this.topicId()).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ quizzes, flashcardSets }) => {
        const flashcardActivities: Activity[] = flashcardSets.map(fs => ({
          id: fs.id,
          title: fs.title,
          type: 'FLASHCARD',
          status: 'PUBLISHED',
          generatedByAi: fs.generatedByAi ?? false,
          topicId: this.topicId()
        }));
        this.activities.set([...quizzes, ...flashcardActivities]);
        this.loading.set(false);
      },
      error: () => { this.error.set('No se pudieron cargar las actividades.'); this.loading.set(false); }
    });
  }

  onActivityCreated(act: Activity) {
    this.activities.update(list => [...list, act]);
    this.showCreateModal.set(false);
    this.load(); // refresca desde backend para tener datos completos
  }

  deleteActivity(id: number, event: Event) {
    event.stopPropagation();
    if (!confirm('¿Eliminar esta actividad?')) return;
    this.actSvc.deleteActivity(id).subscribe({
      next: () => this.activities.update(list => list.filter(a => a.id !== id)),
      error: () => alert('Error al eliminar la actividad.')
    });
  }

  publishActivity(act: Activity, event: Event) {
    event.stopPropagation();
    this.actSvc.publishActivity(act).subscribe({
      next: (updated) => this.activities.update(list => list.map(a => a.id === updated.id ? updated : a)),
      error: (e) => alert(e?.error?.message || 'Error al publicar la actividad.')
    });
  }

  goBack() {
    this.router.navigate(['/docentes/colecciones', this.collectionId()]);
  }

  typeLabel(type: string): string {
    return type === 'QUIZ' ? '📝 Quiz' : '🗂 Flashcards';
  }

  typeClass(type: string): string {
    return type === 'QUIZ' ? 'badge-quiz' : 'badge-flash';
  }
}
