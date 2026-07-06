import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  AssignActivityModalComponent,
  AssignmentFormValue
} from '../assign-activity-modal/assign-activity-modal.component';

interface Assignment {
  activity: string;
  collection: string;
  group: string;
  dueDate: string;
  status: 'Activa' | 'Pendiente' | 'Finalizada';
}

@Component({
  selector: 'app-assignment-list',
  standalone: true,
  imports: [CommonModule, AssignActivityModalComponent],
  templateUrl: './assignment-list.html',
  styleUrl: './assignment-list.css'
})
export class AssignmentListComponent {
  showModal = signal(false);

  assignments = signal<Assignment[]>([
    {
      activity: 'Quiz Variables',
      collection: 'Algoritmos',
      group: 'CC23',
      dueDate: '2026-06-25',
      status: 'Activa'
    },
    {
      activity: 'Flashcards Tipos de Datos',
      collection: 'Estructura de Datos',
      group: 'CC71',
      dueDate: '2026-06-28',
      status: 'Pendiente'
    }
  ]);

  openModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  addAssignment(value: AssignmentFormValue): void {
    this.assignments.update(assignments => [
      ...assignments,
      {
        activity: value.activity,
        collection: value.collection,
        group: value.group,
        dueDate: value.dueDate,
        status: 'Activa'
      }
    ]);

    this.closeModal();
  }
}