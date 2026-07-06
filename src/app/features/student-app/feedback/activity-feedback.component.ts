import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityResultService } from '../../../core/services/activity-result.service';
import { ActivityResultDetail } from '../../../shared/models/student.model';

@Component({
  selector: 'app-activity-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-feedback.html',
  styleUrl: './activity-feedback.css'
})
export class ActivityFeedbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private resultSvc = inject(ActivityResultService);

  loading = signal(true);
  result = signal<ActivityResultDetail | null>(null);

  xpEarned = computed(() => {
    const r = this.result();
    if (!r) return 0;
    return r.correctAnswers * 5 + 10;
  });

  isSingleQuestion = computed(() => (this.result()?.answers.length ?? 0) === 1);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('resultId'));
    this.resultSvc.getResultDetail(id).subscribe({
      next: (r) => { this.result.set(r); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  goToLobby(): void {
    this.router.navigate(['/estudiantes/dashboard']);
  }
}
