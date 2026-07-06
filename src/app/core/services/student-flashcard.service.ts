import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FlashcardSet } from '../../shared/models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentFlashcardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getByTopic(topicId: number): Observable<FlashcardSet> {
    return this.http.get<FlashcardSet>(`${this.apiUrl}/topics/${topicId}/flashcards`);
  }

  getSetsByTopic(topicId: number): Observable<FlashcardSet[]> {
    return this.http.get<FlashcardSet[]>(`${this.apiUrl}/topics/${topicId}/flashcard-sets`);
  }

  recordRecall(flashcardId: number, recalled: boolean): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/flashcards/${flashcardId}/recall`, { recalled });
  }
}
