import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  feedback: string;
}

@Component({
  selector: 'app-ai-editor',
  standalone: true,
  imports: [],
  templateUrl: './ai-editor.html',
  styleUrl: './ai-editor.css',
})
export class AiEditorComponent {
  questions = signal<Question[]>([
    {
      id: 1,
      question: '¿Cuál es el principal objetivo del aprendizaje activo?',
      options: ['Memorizar conceptos', 'Involucrar al estudiante en el proceso', 'Reducir el tiempo de estudio', 'Automatizar tareas'],
      correct: 1,
      feedback: 'El aprendizaje activo busca que el estudiante participe de forma directa en la construcción del conocimiento.'
    },
    {
      id: 2,
      question: '¿Qué tipo de evaluación mide el progreso durante el proceso de aprendizaje?',
      options: ['Sumativa', 'Diagnóstica', 'Formativa', 'Certificadora'],
      correct: 2,
      feedback: 'La evaluación formativa se realiza durante el proceso y permite ajustar la enseñanza en tiempo real.'
    },
    {
      id: 3,
      question: '¿Cuál es una característica del aprendizaje colaborativo?',
      options: ['Trabajo individual', 'Competencia entre pares', 'Construcción conjunta del conocimiento', 'Evaluación estandarizada'],
      correct: 2,
      feedback: 'El aprendizaje colaborativo se centra en la construcción conjunta del conocimiento entre los estudiantes.'
    }
  ]);

  expandedId = signal<number | null>(null);

  private router = inject(Router);

  toggle(id: number): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  publish(): void {
    this.router.navigate(['/docentes/colecciones']);
  }

  back(): void {
    this.router.navigate(['/docentes/actividades/ia/carga']);
  }
}
