import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-progress',
  standalone: true,
  imports: [],
  templateUrl: './ai-progress.html',
  styleUrl: './ai-progress.css',
})
export class AiProgressComponent implements OnInit, OnDestroy {
  steps = ['Selección', 'Carga', 'Procesamiento', 'Revisión', 'Publicación'];
  currentStep = signal(0);

  private interval: ReturnType<typeof setInterval> | null = null;
  private router = inject(Router);

  ngOnInit(): void {
    this.interval = setInterval(() => {
      const next = this.currentStep() + 1;
      if (next < this.steps.length) {
        this.currentStep.set(next);
      } else {
        clearInterval(this.interval!);
        setTimeout(() => this.router.navigate(['/docentes/actividades/ia/editor']), 600);
      }
    }, 1200);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }
}
