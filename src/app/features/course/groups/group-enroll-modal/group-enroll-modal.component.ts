import { Component, inject, input, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../../../core/services/group.service';

@Component({
  selector: 'app-group-enroll-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './group-enroll-modal.html',
  styleUrl: './group-enroll-modal.css',
})
export class GroupEnrollModalComponent {
  private svc = inject(GroupService);

  groupCode = input.required<string>();
  enrolled = output<void>();
  cancelled = output<void>();

  emailsText = signal('');
  loading = signal(false);
  error = signal('');
  successCount = signal(0);

  submit() {
    const emails = this.emailsText().split('\n')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    if (emails.length === 0) { this.error.set('Ingresa al menos un correo.'); return; }

    this.error.set('');
    this.loading.set(true);
    this.svc.enrollStudents(this.groupCode(), emails).subscribe({
      next: () => {
        this.successCount.set(emails.length);
        this.loading.set(false);
        setTimeout(() => this.enrolled.emit(), 1500);
      },
      error: () => { this.error.set('Error al inscribir estudiantes. Verifica los correos.'); this.loading.set(false); }
    });
  }

  close() { this.cancelled.emit(); }
}
