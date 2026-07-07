import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectionService } from '../../../core/services/collection.service';
import { Collection } from '../../../shared/models/collection.model';
import { StudentGroupService } from '../../../core/services/student-group.service';

@Component({
  selector: 'app-codex-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './codex-list.html',
  styleUrl: './codex-list.css'
})
export class CodexListComponent implements OnInit {
  private collectionSvc = inject(CollectionService);
  private groupSvc = inject(StudentGroupService);
  private router = inject(Router);

  loading = signal(true);
  collections = signal<Collection[]>([]);

  showJoinModal = signal(false);
  joinCode = signal('');
  joinError = signal('');
  joining = signal(false);

  ngOnInit(): void {
    this.loadCollections();
  }

  private loadCollections(): void {
    this.loading.set(true);
    this.collectionSvc.getEnrolled().subscribe({
      next: (c) => { this.collections.set(c); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  openTopic(collection: Collection): void {
    this.router.navigate(['/estudiantes/codex', collection.name]);
  }

  openJoinModal(): void {
    this.joinError.set('');
    this.joinCode.set('');
    this.showJoinModal.set(true);
  }

  closeJoinModal(): void {
    this.showJoinModal.set(false);
  }

  submitJoin(): void {
    const code = this.joinCode().trim().toUpperCase();
    if (!code) { this.joinError.set('Ingresa un código.'); return; }
    this.joining.set(true);
    this.groupSvc.joinByCode(code).subscribe({
      next: () => {
        this.joining.set(false);
        this.showJoinModal.set(false);
        this.loadCollections();
      },
      error: (e) => {
        if (e?.status === 403) {
          this.joinError.set('Tu cuenta no tiene permisos de estudiante. Si te registraste por error como docente, crea una cuenta nueva eligiendo "Estudiante".');
        } else {
          this.joinError.set(e?.error?.message || 'Código inválido o expirado.');
        }
        this.joining.set(false);
      }
    });
  }
}
