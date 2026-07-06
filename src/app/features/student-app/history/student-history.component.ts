import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivityResultService } from '../../../core/services/activity-result.service';
import { ActivityResult } from '../../../shared/models/student.model';

@Component({
  selector: 'app-student-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-history.html',
  styleUrl: './student-history.css'
})
export class StudentHistoryComponent implements OnInit {
  private resultSvc = inject(ActivityResultService);
  private router = inject(Router);

  loading = signal(true);
  results = signal<ActivityResult[]>([]);

  ngOnInit(): void {
    this.resultSvc.getMine(undefined, undefined, 'desc').subscribe({
      next: (r) => { this.results.set(r); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  openDetail(r: ActivityResult): void {
    this.router.navigate(['/estudiantes/resultados', r.id]);
  }
}
