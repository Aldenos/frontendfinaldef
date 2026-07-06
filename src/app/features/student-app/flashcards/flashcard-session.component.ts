import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentFlashcardService } from '../../../core/services/student-flashcard.service';
import { FlashcardSet } from '../../../shared/models/student.model';

@Component({
  selector: 'app-flashcard-session',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flashcard-session.html',
  styleUrl: './flashcard-session.css'
})
export class FlashcardSessionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private flashcardSvc = inject(StudentFlashcardService);

  loading = signal(true);
  errorMsg = signal('');
  set = signal<FlashcardSet | null>(null);
  index = signal(0);
  flipped = signal(false);
  recalledCount = signal(0);
  notRecalledCount = signal(0);
  finished = signal(false);

  cards = computed(() => this.set()?.flashcards ?? []);
  current = computed(() => this.cards()[this.index()] ?? null);
  remaining = computed(() => this.cards().length - this.index() - 1);

  ngOnInit(): void {
    const topicId = Number(this.route.snapshot.paramMap.get('topicId'));
    this.flashcardSvc.getByTopic(topicId).subscribe({
      next: (s) => { this.set.set(s); this.loading.set(false); },
      error: () => { this.errorMsg.set('No se pudieron cargar las flashcards de este tema.'); this.loading.set(false); }
    });
  }

  flip(): void {
    this.flipped.set(true);
  }

  answer(recalled: boolean): void {
    const card = this.current();
    if (!card) return;

    this.flashcardSvc.recordRecall(card.id, recalled).subscribe({ next: () => {}, error: () => {} });

    if (recalled) this.recalledCount.update(c => c + 1);
    else this.notRecalledCount.update(c => c + 1);

    if (this.index() + 1 >= this.cards().length) {
      this.finished.set(true);
    } else {
      this.index.update(i => i + 1);
      this.flipped.set(false);
    }
  }

  goToLobby(): void {
    this.router.navigate(['/estudiantes/dashboard']);
  }
}
