import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../../../../core/services/collection.service';
import { TopicService } from '../../../../core/services/topic.service';
import { GroupService } from '../../../../core/services/group.service';
import { Collection } from '../../../../shared/models/collection.model';
import { Topic } from '../../../../shared/models/topic.model';
import { Group } from '../../../../shared/models/group.model';
import { CollectionStatsComponent } from '../collection-stats/collection-stats.component';
import { TopicCreateModalComponent } from '../../topics/topic-create-modal/topic-create-modal.component';
import { GroupCreateModalComponent } from '../../groups/group-create-modal/group-create-modal.component';
import { GroupEnrollModalComponent } from '../../groups/group-enroll-modal/group-enroll-modal.component';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [CollectionStatsComponent, TopicCreateModalComponent, GroupCreateModalComponent, GroupEnrollModalComponent],
  templateUrl: './collection-detail.html',
  styleUrl: './collection-detail.css',
})
export class CollectionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private collectionSvc = inject(CollectionService);
  private topicSvc = inject(TopicService);
  private groupSvc = inject(GroupService);

  collectionId = signal(0);
  collection = signal<Collection | null>(null);
  topics = signal<Topic[]>([]);
  groups = signal<Group[]>([]);

  loading = signal(true);
  error = signal('');
  activeTab = signal<'temas' | 'grupos'>('temas');

  showTopicModal = signal(false);
  showGroupModal = signal(false);
  enrollGroup = signal<Group | null>(null);

  totalActivities = computed(() => this.topics().reduce((acc, t) => acc + (t.activitiesCount ?? 0), 0));

  ngOnInit() {
    this.collectionId.set(Number(this.route.snapshot.paramMap.get('id')));
    this.loadAll();
  }

  loadAll() {
    this.loading.set(true);
    this.collectionSvc.getById(this.collectionId()).subscribe({
      next: (col) => {
        this.collection.set(col);
        this.loading.set(false);
        this.topicSvc.getByCollection(col.name).subscribe({
          next: (t) => this.topics.set(t),
          error: () => {}
        });
      },
      error: () => { this.error.set('No se pudo cargar la colección.'); this.loading.set(false); }
    });
    this.groupSvc.getMyGroups().subscribe({
      next: (g) => this.groups.set(g.filter(gr => gr.collectionId === this.collectionId())),
      error: () => {}
    });
  }

  goToTopic(topicId: number) {
    this.router.navigate(['/docentes/colecciones', this.collectionId(), 'temas', topicId]);
  }

  onTopicCreated(topic: Topic) {
    this.topics.update(list => [...list, topic]);
    this.showTopicModal.set(false);
  }

  onGroupCreated(group: Group) {
    this.groups.update(list => [...list, group]);
    this.showGroupModal.set(false);
  }

  deleteTopic(id: number, event: Event) {
    event.stopPropagation();
    if (!confirm('¿Eliminar este tema? Se eliminarán sus actividades.')) return;
    this.topicSvc.delete(id).subscribe({
      next: () => this.topics.update(list => list.filter(t => t.id !== id)),
      error: () => alert('Error al eliminar el tema.')
    });
  }

  goBack() { this.router.navigate(['/docentes/colecciones']); }
}
