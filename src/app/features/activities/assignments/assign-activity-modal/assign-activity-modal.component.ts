import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface AssignmentFormValue {
  activity: string;
  collection: string;
  group: string;
  dueDate: string;
}

@Component({
  selector: 'app-assign-activity-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-activity-modal.html',
  styleUrl: './assign-activity-modal.css'
})
export class AssignActivityModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Output() assignmentCreated = new EventEmitter<AssignmentFormValue>();

  activities = ['Quiz Variables', 'Flashcards Tipos de Datos', 'Quiz V o F'];
  collections = ['Algoritmos', 'Estructura de Datos'];
  groups = ['CC23', 'CC71', 'CC72'];

  activity = signal('');
  collection = signal('');
  group = signal('');
  dueDate = signal('');
  errorMessage = signal('');

  close(): void {
    this.closeModal.emit();
  }

  createAssignment(): void {
    if (!this.activity() || !this.collection() || !this.group() || !this.dueDate()) {
      this.errorMessage.set('Completa todos los campos para asignar la actividad');
      return;
    }

    this.assignmentCreated.emit({
      activity: this.activity(),
      collection: this.collection(),
      group: this.group(),
      dueDate: this.dueDate()
    });
  }
}