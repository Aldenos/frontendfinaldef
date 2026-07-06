import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentActivityService } from '../../../core/services/student-activity.service';
import { ActivityResultService } from '../../../core/services/activity-result.service';
import { LearningActivity, StudentAnswerSubmit } from '../../../shared/models/student.model';

@Component({
  selector: 'app-quiz-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-player.html',
  styleUrl: './quiz-player.css'
})
export class QuizPlayerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private activitySvc = inject(StudentActivityService);
  private resultSvc = inject(ActivityResultService);

  loading = signal(true);
  errorMsg = signal('');
  activity = signal<LearningActivity | null>(null);
  currentIndex = signal(0);
  selectedOptionText = signal<string | null>(null);
  submitting = signal(false);
  startedAt = Date.now();
  answers: StudentAnswerSubmit[] = [];

  questions = computed(() => this.activity()?.questions ?? []);
  currentQuestion = computed(() => this.questions()[this.currentIndex()] ?? null);
  total = computed(() => this.questions().length);
  isVf = computed(() => {
    const opts = this.currentQuestion()?.options ?? [];
    if (opts.length !== 2) return false;
    const texts = opts.map(o => o.text.trim().toLowerCase());
    return texts.includes('verdadero') && texts.includes('falso');
  });
  isLast = computed(() => this.currentIndex() === this.total() - 1);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('activityId'));
    this.activitySvc.getById(id).subscribe({
      next: (a) => { this.activity.set(a); this.loading.set(false); },
      error: () => { this.errorMsg.set('No se pudo cargar la actividad.'); this.loading.set(false); }
    });
  }

  select(optionText: string): void {
    this.selectedOptionText.set(optionText);
  }

  confirm(): void {
    const q = this.currentQuestion();
    if (!q || !this.selectedOptionText()) return;

    this.answers.push({ questionText: q.statement, selectedOptionText: this.selectedOptionText()! });

    if (this.isLast()) {
      this.submit();
    } else {
      this.currentIndex.update(i => i + 1);
      this.selectedOptionText.set(null);
    }
  }

  private submit(): void {
    const a = this.activity();
    if (!a || !a.topicName) {
      this.errorMsg.set('No se pudo determinar el tema de la actividad.');
      return;
    }
    this.submitting.set(true);
    const timeSpentSeconds = Math.round((Date.now() - this.startedAt) / 1000);

    this.resultSvc.submit(a.topicName, a.title, { timeSpentSeconds, answers: this.answers }).subscribe({
      next: (detail) => {
        this.router.navigate(['/estudiantes/resultados', detail.id]);
      },
      error: () => {
        this.errorMsg.set('Error de conexión. Tus respuestas se guardaron localmente, reintenta el envío.');
        this.submitting.set(false);
      }
    });
  }

  retryConnection(): void {
    this.errorMsg.set('');
    this.submit();
  }
}
