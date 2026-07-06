import { Component, inject, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CollectionService } from '../../../../core/services/collection.service';
import { Collection } from '../../../../shared/models/collection.model';

@Component({
  selector: 'app-collection-create-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './collection-create-modal.html',
  styleUrl: './collection-create-modal.css',
})
export class CollectionCreateModalComponent {
  private svc = inject(CollectionService);

  saved = output<Collection>();
  cancelled = output<void>();

  name = signal('');
  description = signal('');
  loading = signal(false);
  error = signal('');

  submit() {
    if (!this.name().trim()) { this.error.set('El nombre es obligatorio.'); return; }
    this.error.set('');
    this.loading.set(true);
    this.svc.create({ name: this.name().trim(), description: this.description().trim() || undefined }).subscribe({
      next: (col) => { this.loading.set(false); this.saved.emit(col); },
      error: () => { this.error.set('Error al crear la colección.'); this.loading.set(false); }
    });
  }

  close() { this.cancelled.emit(); }
}
