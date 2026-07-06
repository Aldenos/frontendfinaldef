import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../../../shared/layouts/main-layout/breadcrumb/breadcrumb.component';
import { ActivityService } from '../../../../core/services/activity.service';
import { Question, Flashcard } from '../../../../shared/models/activity.model';

@Component({
  selector: 'app-manual-editor',
  standalone: true,
  imports: [FormsModule, BreadcrumbComponent],
  templateUrl: './manual-editor.html',
  styleUrl: './manual-editor.css',
})
export class ManualEditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private actSvc = inject(ActivityService);

  collectionId = signal(0);
  topicId = signal(0);
  breadcrumbs = signal<any[]>([]);

  // Tipo de actividad seleccionada
  activityType = signal<'QUIZ' | 'FLASHCARD'>('QUIZ');
  
  // Datos comunes
  activityTitle = signal('');
  
  // Arreglos dinámicos
  questions = signal<Question[]>([]);
  flashcards = signal<Flashcard[]>([]);
  
  loading = signal(false);
  errorMsg = signal('');

  ngOnInit() {
    this.collectionId.set(Number(this.route.snapshot.paramMap.get('collectionId')));
    this.topicId.set(Number(this.route.snapshot.paramMap.get('topicId')));
    
    this.breadcrumbs.set([
      { label: 'Mis colecciones', url: '/docentes/colecciones' },
      { label: `Tema ${this.topicId()}`, url: `/docentes/colecciones/${this.collectionId()}/temas/${this.topicId()}` },
      { label: 'Crear Manual' }
    ]);

    // Inicializamos con un elemento vacío en cada uno
    this.addQuestion();
    this.addFlashcard();
  }

  // ---- LÓGICA DE QUIZZES ----
  addQuestion() {
    this.questions.update(q => [...q, {
      statement: '',
      options: [
        { text: '', correct: true },
        { text: '', correct: false },
        { text: '', correct: false },
        { text: '', correct: false },
      ]
    }]);
  }
  removeQuestion(index: number) { this.questions.update(q => q.filter((_, i) => i !== index)); }
  setCorrectOption(qIndex: number, optIndex: number) {
    this.questions.update(qs => {
      const updated = [...qs];
      updated[qIndex].options.forEach((opt, idx) => opt.correct = (idx === optIndex));
      return updated;
    });
  }

  // ---- LÓGICA DE FLASHCARDS ----
  addFlashcard() {
    this.flashcards.update(f => [...f, { front: '', back: '' }]);
  }
  removeFlashcard(index: number) { this.flashcards.update(f => f.filter((_, i) => i !== index)); }


  // ---- GUARDADO ESTRICTO HACIA EL BACKEND ----
  save() {
    this.errorMsg.set('');
    if (!this.activityTitle().trim()) { this.errorMsg.set('El título es obligatorio.'); return; }
    
    this.loading.set(true);

    if (this.activityType() === 'QUIZ') {
      this.saveQuiz();
    } else {
      this.saveFlashcards();
    }
  }

  private saveQuiz() {
    // Validación Quiz
    for (let i = 0; i < this.questions().length; i++) {
      const q = this.questions()[i];
      if (!q.statement.trim()) { this.errorMsg.set(`La pregunta ${i + 1} no tiene enunciado.`); this.loading.set(false); return; }
      if (q.options.some(o => !o.text.trim())) { this.errorMsg.set(`La pregunta ${i + 1} tiene opciones vacías.`); this.loading.set(false); return; }
    }

    const dto = {
      title: this.activityTitle().trim(),
      type: 'QUIZ' as const,
      status: 'PUBLISHED' as const,
      generatedByAi: false,
      questions: this.questions()
    };

    this.actSvc.createQuiz(this.topicId(), dto).subscribe({
      next: () => this.router.navigate([`/docentes/colecciones/${this.collectionId()}/temas/${this.topicId()}`]),
      error: () => { this.errorMsg.set('Error guardando Quiz en el servidor.'); this.loading.set(false); }
    });
  }

  private saveFlashcards() {
    // Validación Flashcards
    for (let i = 0; i < this.flashcards().length; i++) {
      const f = this.flashcards()[i];
      if (!f.front.trim() || !f.back.trim()) { 
        this.errorMsg.set(`La tarjeta ${i + 1} está incompleta (falta concepto o definición).`); 
        this.loading.set(false); 
        return; 
      }
    }

    const dto = {
      title: this.activityTitle().trim(),
      generatedByAi: false,
      flashcards: this.flashcards()
    };

    this.actSvc.createFlashcardSet(this.topicId(), dto).subscribe({
      next: () => this.router.navigate([`/docentes/colecciones/${this.collectionId()}/temas/${this.topicId()}`]),
      error: () => { this.errorMsg.set('Error guardando Flashcards en el servidor.'); this.loading.set(false); }
    });
  }

  cancel() {
    this.router.navigate([`/docentes/colecciones/${this.collectionId()}/temas/${this.topicId()}`]);
  }
}