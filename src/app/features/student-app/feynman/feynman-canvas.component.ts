import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../../../core/services/topic.service';
import { ActivityService } from '../../../core/services/activity.service';
import { Topic } from '../../../shared/models/topic.model';
import { FeynmanCheckResult } from '../../../shared/models/activity.model';

@Component({
  selector: 'app-feynman-canvas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feynman-canvas.html',
  styleUrl: './feynman-canvas.css'
})
export class FeynmanCanvasComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private topicSvc = inject(TopicService);
  private activitySvc = inject(ActivityService);

  loading = signal(true);
  topic = signal<Topic | null>(null);
  topicId = signal(0);
  explanation = signal('');
  submitted = signal(false);

  checking = signal(false);
  checkResult = signal<FeynmanCheckResult | null>(null);
  checkError = signal('');

  keyPoints = signal<string[]>([
    '¿Qué problema resuelve este concepto?',
    '¿Cómo lo explicarías con una analogía simple?',
    '¿Cuáles son los pasos o partes principales?',
    '¿Cuándo se usaría en la práctica?'
  ]);

  ngOnInit(): void {
    const topicId = Number(this.route.snapshot.paramMap.get('topicId'));
    this.topicId.set(topicId);
    this.topicSvc.getById(topicId).subscribe({
      next: (t) => { this.topic.set(t); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  finish(): void {
    this.checkError.set('');
    this.checking.set(true);
    this.activitySvc.checkFeynmanExplanation(this.topicId(), this.explanation()).subscribe({
      next: (result) => {
        this.checkResult.set(result);
        this.checking.set(false);
        this.submitted.set(true);
      },
      error: (e) => {
        this.checkError.set(e?.error?.message || 'No se pudo evaluar tu explicación con IA. Intenta de nuevo.');
        this.checking.set(false);
      }
    });
  }

  goToLobby(): void {
    this.router.navigate(['/estudiantes/dashboard']);
  }
}
