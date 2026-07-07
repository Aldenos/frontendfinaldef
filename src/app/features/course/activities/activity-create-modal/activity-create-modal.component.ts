import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../../../core/services/activity.service';
import { Activity, CreateQuizDto } from '../../../../shared/models/activity.model';

type Tab = 'manual' | 'ia';
type ActivityType = 'QUIZ' | 'FLASHCARD';

@Component({
  selector: 'app-activity-create-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './activity-create-modal.html',
  styleUrl: './activity-create-modal.css',
})
export class ActivityCreateModalComponent {
  private svc = inject(ActivityService);

  topicId    = input.required<number>();
  topicName  = input.required<string>();
  saved      = output<Activity>();
  cancelled  = output<void>();
  generated  = output<void>();

  tab         = signal<Tab>('manual');
  actType     = signal<ActivityType>('QUIZ');
  title       = signal('');
  loading     = signal(false);
  error       = signal('');
  successMsg  = signal('');

  // ── QUIZ fields ──
  questions = signal<{ statement: string; explanation: string; options: { text: string; correct: boolean }[] }[]>([
    { statement: '', explanation: '', options: [{ text: '', correct: true }, { text: '', correct: false }] }
  ]);

  // ── FLASHCARD fields ──
  cards = signal<{ front: string; back: string }[]>([{ front: '', back: '' }]);

  // ── AI fields ──
  aiFile     = signal<File | null>(null);
  aiTypes    = signal<{ quiz: boolean; flashcard: boolean }>({ quiz: true, flashcard: false });

  // ── QUIZ helpers ──
  addQuestion() {
    this.questions.update(qs => [...qs, {
      statement: '', explanation: '',
      options: [{ text: '', correct: true }, { text: '', correct: false }]
    }]);
  }

  removeQuestion(i: number) {
    this.questions.update(qs => qs.filter((_, idx) => idx !== i));
  }

  addOption(qi: number) {
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q, options: [...q.options] }));
      copy[qi].options.push({ text: '', correct: false });
      return copy;
    });
  }

  removeOption(qi: number, oi: number) {
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q, options: [...q.options] }));
      copy[qi].options = copy[qi].options.filter((_, idx) => idx !== oi);
      return copy;
    });
  }

  setCorrect(qi: number, oi: number) {
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q, options: q.options.map(o => ({ ...o })) }));
      copy[qi].options.forEach((o, idx) => o.correct = idx === oi);
      return copy;
    });
  }

  updateQuestion(qi: number, field: 'statement' | 'explanation', val: string) {
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q }));
      copy[qi][field] = val;
      return copy;
    });
  }

  updateOption(qi: number, oi: number, val: string) {
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q, options: q.options.map(o => ({ ...o })) }));
      copy[qi].options[oi].text = val;
      return copy;
    });
  }

  // ── FLASHCARD helpers ──
  addCard() { this.cards.update(c => [...c, { front: '', back: '' }]); }

  removeCard(i: number) { this.cards.update(c => c.filter((_, idx) => idx !== i)); }

  updateCard(i: number, side: 'front' | 'back', val: string) {
    this.cards.update(c => {
      const copy = c.map(card => ({ ...card }));
      copy[i][side] = val;
      return copy;
    });
  }

  // ── AI file ──
  onFile(event: Event) {
    const input = event.target as HTMLInputElement;
    this.aiFile.set(input.files?.[0] ?? null);
  }

  // ── SUBMIT ──
  submit() {
    this.error.set('');
    if (!this.title().trim()) { this.error.set('El título es obligatorio.'); return; }

    if (this.tab() === 'manual') {
      this.actType() === 'QUIZ' ? this.submitQuiz() : this.submitFlashcard();
    } else {
      this.submitAI();
    }
  }

  private submitQuiz() {
    const qs = this.questions();
    for (const q of qs) {
      if (!q.statement.trim()) { this.error.set('Todas las preguntas deben tener enunciado.'); return; }
      if (q.options.some(o => !o.text.trim())) { this.error.set('Todas las opciones deben tener texto.'); return; }
      if (!q.options.some(o => o.correct)) { this.error.set('Cada pregunta debe tener al menos una opción correcta.'); return; }
    }

    const dto: CreateQuizDto = {
      title: this.title().trim(),
      type: 'QUIZ',
      status: 'PUBLISHED',
      generatedByAi: false,
      questions: qs.map(q => ({
        statement: q.statement.trim(),
        explanation: q.explanation.trim() || undefined,
        options: q.options.map(o => ({ text: o.text.trim(), correct: o.correct }))
      }))
    };

    this.loading.set(true);
    this.svc.createQuiz(this.topicId(), dto).subscribe({
      next: (act) => { this.loading.set(false); this.saved.emit(act); },
      error: () => { this.error.set('Error al crear el quiz.'); this.loading.set(false); }
    });
  }

  private submitFlashcard() {
    const cs = this.cards();
    if (cs.some(c => !c.front.trim() || !c.back.trim())) {
      this.error.set('Todas las tarjetas deben tener frente y reverso.');
      return;
    }

    const dto = {
      title: this.title().trim(),
      generatedByAi: false,
      flashcards: cs.map(c => ({ front: c.front.trim(), back: c.back.trim() }))
    };

    this.loading.set(true);
    this.svc.createFlashcardSet(this.topicId(), dto).subscribe({
      next: (fs: any) => { this.loading.set(false); this.saved.emit({ ...fs, type: 'FLASHCARD', status: 'PUBLISHED', generatedByAi: false, topicId: this.topicId() }); },
      error: () => { this.error.set('Error al crear el set de flashcards.'); this.loading.set(false); }
    });
  }

  private submitAI() {
    const file = this.aiFile();
    if (!file) { this.error.set('Selecciona un archivo PDF.'); return; }

    const types = this.aiTypes();
    const typesList: string[] = [];
    if (types.quiz) typesList.push('QUIZ');
    if (types.flashcard) typesList.push('FLASHCARD');
    if (typesList.length === 0) { this.error.set('Selecciona al menos un tipo a generar.'); return; }

    this.loading.set(true);
    this.svc.uploadFileForAI(this.topicId(), file, typesList).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMsg.set('¡Actividades generadas con IA! Revisa la lista.');
        this.generated.emit();
        setTimeout(() => this.cancelled.emit(), 2000);
      },
      error: (e) => {
        const msg = e?.error?.message || 'Error al generar con IA. Verifica que el PDF sea válido y menor a 5MB.';
        this.error.set(msg);
        this.loading.set(false);
      }
    });
  }

  close() { this.cancelled.emit(); }
}
