import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/layouts/main-layout/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-select-type',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './select-type.html',
  styleUrl: './select-type.css',
})
export class SelectTypeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  collectionId = signal(0);
  topicId = signal(0);
  
  // Lista reactiva para el componente de migas de pan
  breadcrumbs = signal<{label: string, url?: string}[]>([]);

  ngOnInit() {
    // 1. Extraemos los IDs estrictos de la URL actual
    this.collectionId.set(Number(this.route.snapshot.paramMap.get('collectionId')));
    this.topicId.set(Number(this.route.snapshot.paramMap.get('topicId')));

    // 2. Construimos la navegación superior
    this.breadcrumbs.set([
      { label: 'Mis colecciones', url: '/docentes/colecciones' },
      { label: `Colección ${this.collectionId()}`, url: `/docentes/colecciones/${this.collectionId()}` },
      { label: `Tema ${this.topicId()}`, url: `/docentes/colecciones/${this.collectionId()}/temas/${this.topicId()}` },
      { label: 'Crear Actividad' }
    ]);
  }

  // Navega al editor manual
  goManual() {
    this.router.navigate(['../manual'], { relativeTo: this.route });
  }

  // Navega al flujo de subida de IA
  goAI() {
    this.router.navigate(['../ia/subir'], { relativeTo: this.route });
  }
}