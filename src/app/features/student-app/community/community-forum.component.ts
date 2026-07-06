import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentProfileService } from '../../../core/services/student-profile.service';

interface ForumPost {
  authorInitials: string;
  authorName: string;
  level: number;
  badge: string;
  text: string;
  xp: number;
  reactions: number;
}

@Component({
  selector: 'app-community-forum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community-forum.html',
  styleUrl: './community-forum.css'
})
export class CommunityForumComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private profileSvc = inject(StudentProfileService);

  topicName = signal('');
  newPostText = signal('');
  myInitials = signal('ES');

  // Datos de ejemplo locales: no existe backend de comunidad todavía
  posts = signal<ForumPost[]>([
    { authorInitials: 'AC', authorName: 'Andrea C.', level: 14, badge: 'Algoritmo Maestro', text: 'Para entender los punteros, piénsalos como un GPS: la dirección te dice dónde está el dato, no el dato en sí.', xp: 12, reactions: 5 },
    { authorInitials: 'RT', authorName: 'Rodrigo T.', level: 9, badge: 'Guerrero del Código', text: '¿Alguien más tuvo problemas con el dangling pointer? Lo que entendí es que si liberas la memoria con free() y sigues usando el puntero, ahí está el error.', xp: 3, reactions: 2 },
  ]);

  ngOnInit(): void {
    this.topicName.set(this.route.snapshot.paramMap.get('topicName') ?? '');
    this.profileSvc.getMyProfile().subscribe({
      next: (p) => this.myInitials.set(((p.firstName?.[0] ?? '') + (p.lastName?.[0] ?? '')).toUpperCase() || 'ES'),
      error: () => {}
    });
  }

  publish(): void {
    const text = this.newPostText().trim();
    if (!text) return;
    this.posts.update(p => [{
      authorInitials: this.myInitials(),
      authorName: 'Tú',
      level: 1,
      badge: 'Recién Llegado',
      text,
      xp: 0,
      reactions: 0
    }, ...p]);
    this.newPostText.set('');
  }

  goBack(): void {
    this.router.navigate(['/estudiantes/comunidad']);
  }
}
