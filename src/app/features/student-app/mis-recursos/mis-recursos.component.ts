import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentActivityService } from '../../../core/services/student-activity.service';
import { CollectionService } from '../../../core/services/collection.service';
import { TopicService } from '../../../core/services/topic.service';
import { LearningActivity } from '../../../shared/models/student.model';
import { Collection } from '../../../shared/models/collection.model';
import { Topic } from '../../../shared/models/topic.model';

@Component({
  selector: 'app-mis-recursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-recursos.component.html',
  styleUrl: './mis-recursos.component.css'
})
export class MisRecursosComponent implements OnInit {
  private actSvc    = inject(StudentActivityService);
  private colSvc    = inject(CollectionService);
  private topicSvc  = inject(TopicService);
  private router    = inject(Router);

  loading    = signal(true);
  recursos   = signal<LearningActivity[]>([]);
  showModal  = signal(false);

  // ── Paso del wizard ──
  step = signal<1 | 2 | 3>(1); // 1: colección, 2: tema, 3: preguntas

  // ── Datos del wizard ──
  collections      = signal<Collection[]>([]);
  topics           = signal<Topic[]>([]);
  selectedCol      = signal<Collection | null>(null);
  selectedTopic    = signal<Topic | null>(null);
  actTitle         = signal('');
  saving           = signal(false);
  modalError       = signal('');

  questions = signal<{ statement: string; explanation: string; options: { text: string; correct: boolean }[] }[]>([
    { statement: '', explanation: '', options: [{ text: '', correct: true }, { text: '', correct: false }] }
  ]);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.actSvc.getMyResources().subscribe({
      next: (r) => { this.recursos.set(r); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openModal(): void {
    this.step.set(1);
    this.selectedCol.set(null);
    this.selectedTopic.set(null);
    this.actTitle.set('');
    this.modalError.set('');
    this.resetQuestions();
    this.showModal.set(true);
    this.colSvc.getEnrolled().subscribe({ next: c => this.collections.set(c) });
  }

  selectCollection(col: Collection): void {
    this.selectedCol.set(col);
    this.topics.set([]);
    this.topicSvc.getByCollection(col.name).subscribe({ next: t => this.topics.set(t) });
    this.step.set(2);
  }

  selectTopic(topic: Topic): void {
    this.selectedTopic.set(topic);
    this.step.set(3);
  }

  // ── Manejo de preguntas ──
  addQuestion(): void {
    this.questions.update(qs => [...qs, {
      statement: '', explanation: '',
      options: [{ text: '', correct: true }, { text: '', correct: false }]
    }]);
  }

  removeQuestion(i: number): void {
    this.questions.update(qs => qs.filter((_, idx) => idx !== i));
  }

  addOption(qi: number): void {
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q, options: [...q.options] }));
      copy[qi].options.push({ text: '', correct: false });
      return copy;
    });
  }

  removeOption(qi: number, oi: number): void {
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q, options: [...q.options] }));
      copy[qi].options = copy[qi].options.filter((_, idx) => idx !== oi);
      return copy;
    });
  }

  setCorrect(qi: number, oi: number): void {
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q, options: q.options.map(o => ({ ...o })) }));
      copy[qi].options.forEach((o, idx) => o.correct = idx === oi);
      return copy;
    });
  }

  updateQuestion(qi: number, field: 'statement' | 'explanation', val: string): void {
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q }));
      copy[qi][field] = val;
      return copy;
    });
  }

  updateOption(qi: number, oi: number, val: string): void {
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q, options: q.options.map(o => ({ ...o })) }));
      copy[qi].options[oi].text = val;
      return copy;
    });
  }

  private resetQuestions(): void {
    this.questions.set([{
      statement: '', explanation: '',
      options: [{ text: '', correct: true }, { text: '', correct: false }]
    }]);
  }

  save(): void {
    this.modalError.set('');
    if (!this.actTitle().trim()) { this.modalError.set('El título es obligatorio.'); return; }
    const qs = this.questions();
    for (const q of qs) {
      if (!q.statement.trim()) { this.modalError.set('Todas las preguntas necesitan enunciado.'); return; }
      if (q.options.some(o => !o.text.trim())) { this.modalError.set('Todas las opciones deben tener texto.'); return; }
      if (!q.options.some(o => o.correct)) { this.modalError.set('Cada pregunta debe tener una respuesta correcta.'); return; }
    }

    const dto = {
      title: this.actTitle().trim(),
      type: 'QUIZ',
      questions: qs.map(q => ({
        statement: q.statement.trim(),
        explanation: q.explanation.trim() || undefined,
        options: q.options.map(o => ({ text: o.text.trim(), correct: o.correct }))
      }))
    };

    this.saving.set(true);
    this.actSvc.createPersonalActivity(this.selectedTopic()!.id, dto).subscribe({
      next: (act) => {
        this.saving.set(false);
        this.showModal.set(false);
        this.recursos.update(r => [act, ...r]);
        // Navegar al quiz para resolverlo de inmediato
        this.router.navigate(['/estudiantes/quiz', act.id]);
      },
      error: () => { this.modalError.set('Error al guardar. Intenta de nuevo.'); this.saving.set(false); }
    });
  }

  playActivity(act: LearningActivity): void {
    this.router.navigate(['/estudiantes/quiz', act.id]);
  }

  typeLabel(type: string): string {
    return type === 'QUIZ' ? '📝 Quiz' : '🗂 Flashcards';
  }
}
