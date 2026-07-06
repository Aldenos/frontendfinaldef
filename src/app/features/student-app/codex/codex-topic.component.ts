import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../../../core/services/topic.service';
import { StudentActivityService } from '../../../core/services/student-activity.service';
import { StudentFlashcardService } from '../../../core/services/student-flashcard.service';
import { Topic } from '../../../shared/models/topic.model';
import { LearningActivity, FlashcardSet } from '../../../shared/models/student.model';

@Component({
  selector: 'app-codex-topic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './codex-topic.html',
  styleUrl: './codex-topic.css'
})
export class CodexTopicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private topicSvc = inject(TopicService);
  private activitySvc = inject(StudentActivityService);
  private flashcardSvc = inject(StudentFlashcardService);

  loading = signal(true);
  collectionName = signal('');
  topic = signal<Topic | null>(null);
  activities = signal<LearningActivity[]>([]);
  flashcardSet = signal<FlashcardSet | null>(null);

  ngOnInit(): void {
    const collectionName = this.route.snapshot.paramMap.get('collectionName')!;
    const topicId = Number(this.route.snapshot.paramMap.get('topicId'));
    this.collectionName.set(collectionName);

    this.topicSvc.getById(topicId).subscribe({
      next: (t) => { this.topic.set(t); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });

    this.activitySvc.getByTopic(topicId).subscribe({
      next: (a) => this.activities.set(a.filter(x => x.status === 'PUBLISHED')),
      error: () => {}
    });

    this.flashcardSvc.getByTopic(topicId).subscribe({
      next: (s) => this.flashcardSet.set(s),
      error: () => this.flashcardSet.set(null)
    });
  }

  startQuiz(activity: LearningActivity): void {
    this.router.navigate(['/estudiantes/quiz', activity.id]);
  }

  startFlashcards(): void {
    this.router.navigate(['/estudiantes/flashcards', this.topic()?.id]);
  }

  startFeynman(): void {
    this.router.navigate(['/estudiantes/feynman', this.topic()?.id]);
  }

  goBack(): void {
    this.router.navigate(['/estudiantes/codex', this.collectionName()]);
  }
}
