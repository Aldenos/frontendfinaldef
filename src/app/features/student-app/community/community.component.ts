import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CollectionService } from '../../../core/services/collection.service';
import { Collection } from '../../../shared/models/collection.model';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community.html',
  styleUrl: './community.css'
})
export class CommunityComponent implements OnInit {
  private collectionSvc = inject(CollectionService);
  private router = inject(Router);

  loading = signal(true);
  collections = signal<Collection[]>([]);

  ngOnInit(): void {
    this.collectionSvc.getAll().subscribe({
      next: (c) => { this.collections.set(c); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  // Conteo simulado de participantes (no hay backend de comunidad aún)
  mockParticipants(id: number): number {
    return 15 + (id * 7) % 40;
  }

  mockUnread(id: number): number {
    return (id * 3) % 16;
  }

  openForum(c: Collection): void {
    this.router.navigate(['/estudiantes/comunidad', c.name]);
  }
}
