import { Component, inject, input, signal, OnInit } from '@angular/core';
import { GroupService } from '../../../../core/services/group.service';
import { Group } from '../../../../shared/models/group.model';
import { GroupCreateModalComponent } from '../group-create-modal/group-create-modal.component';
import { GroupEnrollModalComponent } from '../group-enroll-modal/group-enroll-modal.component';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [GroupCreateModalComponent, GroupEnrollModalComponent],
  templateUrl: './group-list.html',
  styleUrl: './group-list.css',
})
export class GroupListComponent implements OnInit {
  private svc = inject(GroupService);

  collectionId = input.required<number>();

  groups = signal<Group[]>([]);
  loading = signal(true);
  showCreateModal = signal(false);
  enrollGroup = signal<Group | null>(null);

  ngOnInit() {
    this.svc.getMyGroups().subscribe({
      next: (g) => {
        this.groups.set(g.filter(gr => gr.collectionId === this.collectionId()));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onGroupCreated(group: Group) {
    this.groups.update(list => [...list, group]);
    this.showCreateModal.set(false);
  }
}
