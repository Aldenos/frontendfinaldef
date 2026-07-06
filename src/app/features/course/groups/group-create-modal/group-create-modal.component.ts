import { Component, inject, input, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../../core/services/group.service';
import { Group } from '../../../../shared/models/group.model';

@Component({
  selector: 'app-group-create-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './group-create-modal.html',
  styleUrl: './group-create-modal.css',
})
export class GroupCreateModalComponent {
  private svc = inject(GroupService);

  collectionId = input.required<number>();
  saved = output<Group>();
  cancelled = output<void>();

  name = signal('');
  code = signal('');
  loading = signal(false);
  error = signal('');

  submit() {
    if (!this.name().trim() || !this.code().trim()) { this.error.set('Nombre y código son obligatorios.'); return; }
    this.error.set('');
    this.loading.set(true);
    this.svc.createGroup({ name: this.name().trim(), code: this.code().trim().toUpperCase(), collectionId: this.collectionId() }).subscribe({
      next: (group) => { this.loading.set(false); this.saved.emit(group); },
      error: () => { this.error.set('Error al crear el grupo. Verifica que el código no exista.'); this.loading.set(false); }
    });
  }

  close() { this.cancelled.emit(); }
}
