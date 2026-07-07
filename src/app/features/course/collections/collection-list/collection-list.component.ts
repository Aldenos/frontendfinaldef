import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionService } from '../../../../core/services/collection.service';
import { Collection } from '../../../../shared/models/collection.model';
import { CollectionCreateModalComponent } from '../collection-create-modal/collection-create-modal.component';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CollectionCreateModalComponent],
  templateUrl: './collection-list.html',
  styleUrl: './collection-list.css',
})
export class CollectionListComponent implements OnInit {
  private collectionSvc = inject(CollectionService);
  private router = inject(Router);

  collections = signal<Collection[]>([]);
  loading = signal(true);
  error = signal('');
  showModal = signal(false);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.collectionSvc.getMine().subscribe({
      next: (data) => { this.collections.set(data); this.loading.set(false); },
      error: () => { this.error.set('No se pudieron cargar las colecciones.'); this.loading.set(false); }
    });
  }

  openDetail(id: number) {
    this.router.navigate(['/docentes/colecciones', id]);
  }

  onCreated(col: Collection) {
    this.collections.update(list => [...list, col]);
    this.showModal.set(false);
  }
}
