import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.css',
})
export class TeacherDashboardComponent {
  private auth = inject(AuthService);

  user = computed(() => this.auth.getUser());

  firstName = computed(() => this.user()?.firstName || 'Docente');

  steps = [
    {
      icon: '📚',
      title: 'Crea una colección',
      description: 'Organiza tu contenido agrupando temas por curso o unidad.',
      link: '/docentes/colecciones',
      label: 'Ir a Mis colecciones'
    },
    {
      icon: '👥',
      title: 'Registra tus grupos',
      description: 'Añade los grupos de estudiantes que participarán en tus colecciones.',
      link: '/docentes/estudiantes',
      label: 'Ir a Estudiantes'
    },
    {
      icon: '🤖',
      title: 'Genera actividades con IA',
      description: 'Sube un PDF o Word y deja que la IA cree quizzes y flashcards por ti.',
      link: '/docentes/colecciones',
      label: 'Empezar ahora'
    },
    {
      icon: '🗺️',
      title: 'Analiza las brechas',
      description: 'Consulta la Ruta de Aprendizaje para identificar temas que necesitan refuerzo.',
      link: '/docentes/hub-ruta',
      label: 'Ver ruta'
    }
  ];
}
