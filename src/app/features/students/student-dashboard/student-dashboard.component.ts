import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectionService } from '../../../core/services/collection.service';
import { GroupService } from '../../../core/services/group.service';
import { Collection } from '../../../shared/models/collection.model';
import { Group, GroupJoinCode, Student } from '../../../shared/models/group.model';
import { GroupEnrollModalComponent } from '../../course/groups/group-enroll-modal/group-enroll-modal.component';

@Component({
    selector: 'app-student-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, GroupEnrollModalComponent],
    templateUrl: './student-dashboard.html',
    styleUrl: './student-dashboard.css'
})
export class StudentDashboardComponent implements OnInit {
    private collectionSvc = inject(CollectionService);
    private groupSvc = inject(GroupService);
    private router = inject(Router);

    groups = signal<Group[]>([]);
    collections = signal<Collection[]>([]);
    loading = signal(true);
    loadError = signal('');

    showModal = signal(false);
    groupCode = signal('');
    groupName = signal('');
    selectedCollectionId = signal<number | null>(null);
    duplicateError = signal(false);
    saving = signal(false);
    modalError = signal('');

    enrollGroup = signal<Group | null>(null);
    joinCodeResult = signal<GroupJoinCode | null>(null);
    joinCodeError = signal('');
    generatingCodeFor = signal<number | null>(null);

    expandedGroupId = signal<number | null>(null);
    groupStudents = signal<Student[]>([]);
    loadingStudents = signal(false);
    studentsError = signal('');

    collectionNameById = computed(() => {
        const map = new Map<number, string>();
        for (const c of this.collections()) map.set(c.id, c.name);
        return map;
    });

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading.set(true);
        this.loadError.set('');
        this.collectionSvc.getMine().subscribe({
            next: (cols) => this.collections.set(cols),
            error: () => this.loadError.set('No se pudieron cargar tus colecciones.')
        });
        this.groupSvc.getMyGroups().subscribe({
            next: (g) => { this.groups.set(g); this.loading.set(false); },
            error: () => { this.loadError.set('No se pudieron cargar tus grupos.'); this.loading.set(false); }
        });
    }

    collectionName(group: Group): string {
        if (group.collectionName) return group.collectionName;
        if (!group.collectionId) return 'Sin colección';
        return this.collectionNameById().get(group.collectionId) ?? 'Sin colección';
    }

    openModal(): void {
        this.showModal.set(true);
        this.clearForm();
    }

    closeModal(): void {
        this.showModal.set(false);
        this.clearForm();
    }

    onGroupCodeChange(value: string): void {
        const normalizedValue = value.toUpperCase();
        this.groupCode.set(normalizedValue);
        this.duplicateError.set(this.existsGroup(normalizedValue));
    }

    createGroup(): void {
        const code = this.groupCode().trim().toUpperCase();
        const name = this.groupName().trim();
        const collectionId = this.selectedCollectionId();

        if (!code || !name || !collectionId) {
            this.modalError.set('Nombre, código y colección son obligatorios.');
            return;
        }
        if (this.existsGroup(code)) {
            this.duplicateError.set(true);
            return;
        }

        this.modalError.set('');
        this.saving.set(true);
        this.groupSvc.createGroup({ name, code, collectionId }).subscribe({
            next: (group) => {
                this.groups.update(list => [...list, group]);
                this.saving.set(false);
                this.closeModal();
            },
            error: () => {
                this.modalError.set('Error al crear el grupo. Verifica que el código no esté en uso.');
                this.saving.set(false);
            }
        });
    }

    generateJoinCode(group: Group): void {
        this.joinCodeError.set('');
        this.generatingCodeFor.set(group.id);
        this.groupSvc.generateJoinCode(group.code).subscribe({
            next: (jc) => { this.joinCodeResult.set(jc); this.generatingCodeFor.set(null); },
            error: () => {
                this.joinCodeError.set('No se pudo generar el código. Intenta de nuevo.');
                this.generatingCodeFor.set(null);
            }
        });
    }

    closeJoinCodeResult(): void {
        this.joinCodeResult.set(null);
        this.joinCodeError.set('');
    }

    goToCollection(group: Group): void {
        if (group.collectionId) {
            this.router.navigate(['/docentes/colecciones', group.collectionId]);
        }
    }

    toggleRoster(group: Group): void {
        if (this.expandedGroupId() === group.id) {
            this.expandedGroupId.set(null);
            return;
        }
        this.expandedGroupId.set(group.id);
        this.studentsError.set('');
        this.groupStudents.set([]);
        this.loadingStudents.set(true);
        this.groupSvc.getStudentsByGroupCode(group.code).subscribe({
            next: (students) => { this.groupStudents.set(students); this.loadingStudents.set(false); },
            error: () => { this.studentsError.set('No se pudo cargar el listado de alumnos.'); this.loadingStudents.set(false); }
        });
    }

    private existsGroup(code: string): boolean {
        return this.groups().some(group => group.code.trim().toUpperCase() === code.trim().toUpperCase());
    }

    private clearForm(): void {
        this.groupCode.set('');
        this.groupName.set('');
        this.selectedCollectionId.set(null);
        this.duplicateError.set(false);
        this.modalError.set('');
    }
}
