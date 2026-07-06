import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-upload',
  standalone: true,
  imports: [],
  templateUrl: './ai-upload.html',
  styleUrl: './ai-upload.css',
})
export class AiUploadComponent {
  selectedFile = signal<File | null>(null);
  dragOver = signal(false);
  private router = inject(Router);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave(): void {
    this.dragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.selectedFile.set(file);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.selectedFile.set(input.files[0]);
  }

  removeFile(): void {
    this.selectedFile.set(null);
  }

  process(): void {
    if (!this.selectedFile()) return;
    this.router.navigate(['/docentes/actividades/ia/progreso']);
  }
}
