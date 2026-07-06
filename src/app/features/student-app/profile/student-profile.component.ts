import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentProfileService, StudentProfile } from '../../../core/services/student-profile.service';
import { ActivityResultService } from '../../../core/services/activity-result.service';
import { StudentLearningPathService } from '../../../core/services/student-learning-path.service';
import { ActivityResult, LearningPath } from '../../../shared/models/student.model';

interface Badge {
  icon: string;
  label: string;
  unlocked: boolean;
}

@Component({
  selector: 'app-student-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css'
})
export class StudentProfilePageComponent implements OnInit {
  private profileSvc = inject(StudentProfileService);
  private resultSvc = inject(ActivityResultService);
  private pathSvc = inject(StudentLearningPathService);

  loading = signal(true);
  profile = signal<StudentProfile | null>(null);
  results = signal<ActivityResult[]>([]);
  paths = signal<LearningPath[]>([]);

  streak = computed(() => {
    const days = new Set(this.results().map(r => new Date(r.completedAt).toDateString()));
    let streak = 0;
    const cursor = new Date();
    while (days.has(cursor.toDateString())) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  });

  globalMastery = computed(() => {
    const p = this.paths();
    if (p.length === 0) return 0;
    return Math.round(p.reduce((acc, lp) => acc + (lp.currentPercentage || 0), 0) / p.length);
  });

  mainQuests = computed(() => this.results().length);
  sideQuests = computed(() => this.paths().flatMap(p => p.conceptualGaps).filter(g => !g.resolved).length);

  avgScore = computed(() => {
    const r = this.results();
    if (r.length === 0) return 0;
    return Math.round(r.reduce((acc, x) => acc + (x.score || 0), 0) / r.length);
  });

  badges = computed<Badge[]>(() => [
    { icon: '🏆', label: 'Primera Misión', unlocked: this.mainQuests() >= 1 },
    { icon: '⚡', label: 'Racha de 3 días', unlocked: this.streak() >= 3 },
    { icon: '🔍', label: 'Explorador del Codex', unlocked: this.mainQuests() >= 5 },
    { icon: '🌐', label: 'Dominio Global 70%', unlocked: this.globalMastery() >= 70 },
    { icon: '🌳', label: '10 Misiones Completadas', unlocked: this.mainQuests() >= 10 },
  ]);

  ngOnInit(): void {
    this.profileSvc.getMyProfile().subscribe({
      next: (p) => { this.profile.set(p); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
    this.resultSvc.getMine().subscribe({ next: (r) => this.results.set(r), error: () => {} });
    this.pathSvc.getMine().subscribe({ next: (p) => this.paths.set(p), error: () => {} });
  }

  get initials(): string {
    const p = this.profile();
    if (!p) return '';
    return ((p.firstName?.[0] ?? '') + (p.lastName?.[0] ?? '')).toUpperCase();
  }
}
