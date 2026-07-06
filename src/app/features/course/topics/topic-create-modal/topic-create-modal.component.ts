import { Component, inject, input, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TopicService } from '../../../../core/services/topic.service';
import { Topic } from '../../../../shared/models/topic.model';

@Component({
  selector: 'app-topic-create-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './topic-create-modal.html',
  styleUrl: './topic-create-modal.css',
})
export class TopicCreateModalComponent {
  private svc = inject(TopicService);

  collectionName = input.required<string>();
  saved = output<Topic>();
  cancelled = output<void>();

  name = signal('');
  description = signal('');
  loading = signal(false);
  error = signal('');

  submit() {
    if (!this.name().trim()) { this.error.set('El nombre es obligatorio.'); return; }
    this.error.set('');
    this.loading.set(true);
    this.svc.create(this.collectionName(), { name: this.name().trim(), description: this.description().trim() || undefined }).subscribe({
      next: (topic) => { this.loading.set(false); this.saved.emit(topic); },
      error: () => { this.error.set('Error al crear el tema.'); this.loading.set(false); }
    });
  }

  close() { this.cancelled.emit(); }
}
