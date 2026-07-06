import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../../../core/services/topic.service';
import { StudentLearningPathService } from '../../../core/services/student-learning-path.service';
import { Topic } from '../../../shared/models/topic.model';
import { PathNode } from '../../../shared/models/student.model';

@Component({
  selector: 'app-codex-collection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './codex-collection.html',
  styleUrl: './codex-collection.css'
})
export class CodexCollectionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private topicSvc = inject(TopicService);
  private pathSvc = inject(StudentLearningPathService);

  loading = signal(true);
  collectionName = signal('');
  topics = signal<Topic[]>([]);
  pathNodes = signal<PathNode[]>([]);

  topicsWithProgress = computed(() =>
    this.topics().map(t => {
      const node = this.pathNodes().find(n => n.topicName === t.name);
      return { topic: t, mastery: node?.masteryScore ?? 0, completed: node?.completed ?? false };
    })
  );

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('collectionName')!;
    this.collectionName.set(name);

    this.topicSvc.getByCollection(name).subscribe({
      next: (t) => { this.topics.set(t); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });

    this.pathSvc.getAdaptivePath(name).subscribe({
      next: (p) => this.pathNodes.set(p.pathNodes ?? []),
      error: () => {}
    });
  }

  openTopic(topic: Topic): void {
    this.router.navigate(['/estudiantes/codex', this.collectionName(), 'temas', topic.id]);
  }

  goBack(): void {
    this.router.navigate(['/estudiantes/codex']);
  }
}
