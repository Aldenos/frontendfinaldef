import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface StudentGroup {
    code: string;
    collection: string;
    students: number;
    status: 'Activo' | 'Nivel Crítico';
}

@Component({
    selector: 'app-student-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './student-dashboard.html',
    styleUrl: './student-dashboard.css'
})
export class StudentDashboardComponent {
    groups = signal<StudentGroup[]>([
        {
            code: 'CC23',
            collection: 'Algoritmos',
            students: 32,
            status: 'Activo'
    },
    {
        code: 'CC71',
        collection: 'Estructura de Datos',
        students: 28,
        status: 'Activo'
    },
    {
        code: 'CC72',
        collection: 'Algoritmos',
        students: 36,
        status: 'Nivel Crítico'
    }
]);
    collections = ['Algoritmos', 'Estructura de Datos', 'Base de Datos'];
    showModal = signal(false);
    groupCode = signal('');
    selectedCollection = signal('');
    studentsText = signal('');
    duplicateError = signal(false);

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
    const collection = this.selectedCollection();

    if (!code || !collection) return;

    if (this.existsGroup(code)) {
        this.duplicateError.set(true);
        return;
    }

    this.groups.update(groups => [
        ...groups,
        {
        code,
        collection,
        students: this.countStudents(this.studentsText()),
        status: 'Activo'
    }
    ]);

    this.closeModal();
}

    private existsGroup(code: string): boolean {
    return this.groups().some(group => group.code === code.trim().toUpperCase());
}

    private countStudents(text: string): number {
    if (!text.trim()) return 0;

    return text
    .split('\n')
    .map(student => student.trim())
    .filter(student => student.length > 0).length;
}

    private clearForm(): void {
    this.groupCode.set('');
    this.selectedCollection.set('');
    this.studentsText.set('');
    this.duplicateError.set(false);
}
}