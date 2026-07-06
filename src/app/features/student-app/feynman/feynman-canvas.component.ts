import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../../../core/services/topic.service';
import { Topic } from '../../../shared/models/topic.model';

interface KeyPointCheck {
  label: string;
  found: boolean;
}

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

  loading = signal(true);
  topic = signal<Topic | null>(null);
  explanation = signal('');
  submitted = signal(false);

  keyPoints = signal<string[]>([
    '¿Qué problema resuelve este concepto?',
    '¿Cómo lo explicarías con una analogía simple?',
    '¿Cuáles son los pasos o partes principales?',
    '¿Cuándo se usaría en la práctica?'
  ]);

  checks = computed<KeyPointCheck[]>(() => {
    const text = this.explanation().toLowerCase();
    return this.keyPoints().map(label => ({
      label,
      found: this.heuristicMatch(text, label)
    }));
  });

  checksPassed = computed(() => this.checks().filter(c => c.found).length);

  ngOnInit(): void {
    const topicId = Number(this.route.snapshot.paramMap.get('topicId'));
    this.topicSvc.getById(topicId).subscribe({
      next: (t) => { this.topic.set(t); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  private heuristicMatch(text: string, keyPointLabel: string): boolean {
    if (keyPointLabel.includes('analogía')) return /como|igual que|se parece a|imagina/.test(text);
    if (keyPointLabel.includes('problema')) return /resuelve|sirve para|permite|evita/.test(text);
    if (keyPointLabel.includes('pasos')) return /primero|luego|después|paso/.test(text);
    if (keyPointLabel.includes('práctica')) return /ejemplo|cuando|en caso de|se usa/.test(text);
    return text.length > 30;
  }

  finish(): void {
    this.submitted.set(true);
  }

  goToLobby(): void {
    this.router.navigate(['/estudiantes/dashboard']);
  }
}
