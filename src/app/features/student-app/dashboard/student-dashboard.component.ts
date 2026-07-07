import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentActivityService } from '../../../core/services/student-activity.service';
import { StudentLearningPathService } from '../../../core/services/student-learning-path.service';
import { ActivityResultService } from '../../../core/services/activity-result.service';
import { LearningActivity, LearningPath, TimelinePoint } from '../../../shared/models/student.model';

interface Mission {
  activity: LearningActivity;
  icon: string;
  estimatedMin: number;
  critical: boolean;
}

@Component({
  selector: 'app-student-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboardHomeComponent implements OnInit {
  private activitySvc = inject(StudentActivityService);
  private pathSvc = inject(StudentLearningPathService);
  private resultSvc = inject(ActivityResultService);
  private router = inject(Router);

  loading = signal(true);
  pending = signal<LearningActivity[]>([]);
  paths = signal<LearningPath[]>([]);
  timeline = signal<TimelinePoint[]>([]);

  missions = computed<Mission[]>(() =>
    this.pending().map((a, i) => ({
      activity: a,
      icon: a.type === 'FLASHCARD' ? '🃏' : '⚡',
      estimatedMin: a.type === 'FLASHCARD' ? 10 : 15,
      critical: i === 0
    }))
  );

  priorityGaps = computed(() =>
    this.paths().flatMap(p => p.conceptualGaps.filter(g => !g.resolved))
  );

  // Últimos 7 días (más antiguo primero); "filled" = tuvo al menos una actividad completada ese día.
  weekDots = computed(() => {
    const activeDays = new Set(this.timeline().map(t => new Date(t.date).toDateString()));
    const days: { filled: boolean }[] = [];
    const cursor = new Date();
    cursor.setDate(cursor.getDate() - 6);
    for (let i = 0; i < 7; i++) {
      days.push({ filled: activeDays.has(cursor.toDateString()) });
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  });

  ngOnInit(): void {
    this.activitySvc.getPending().subscribe({
      next: (a) => { this.pending.set(a); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
    this.pathSvc.getMine().subscribe({
      next: (p) => this.paths.set(p),
      error: () => {}
    });
    this.resultSvc.getTimeline().subscribe({
      next: (t) => this.timeline.set(t),
      error: () => {}
    });
  }

  startMission(m: Mission): void {
    if (m.activity.type === 'FLASHCARD') {
      this.router.navigate(['/estudiantes/flashcards', m.activity.topicId]);
    } else {
      this.router.navigate(['/estudiantes/quiz', m.activity.id]);
    }
  }

  goToCodex(): void {
    this.router.navigate(['/estudiantes/codex']);
  }
}
