import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity, FlashcardSet, CreateQuizDto } from '../../shared/models/activity.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private http = inject(HttpClient);

  // Quizzes (ActivityController)
  getByTopic(topicId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${environment.apiUrl}/topics/${topicId}/activities`);
  }

  createQuiz(topicId: number, dto: CreateQuizDto): Observable<Activity> {
    return this.http.post<Activity>(`${environment.apiUrl}/topics/${topicId}/activities`, dto);
  }

  publishActivity(activity: Activity): Observable<Activity> {
    const dto = {
      title: activity.title,
      description: activity.description,
      type: activity.type,
      status: 'PUBLISHED',
      generatedByAi: activity.generatedByAi
    };
    return this.http.put<Activity>(`${environment.apiUrl}/activities/${activity.id}`, dto);
  }

  deleteActivity(activityId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/activities/${activityId}`);
  }

  // Flashcards (FlashcardController)
  createFlashcardSet(topicId: number, dto: FlashcardSet): Observable<FlashcardSet> {
    return this.http.post<FlashcardSet>(`${environment.apiUrl}/topics/${topicId}/flashcard-sets`, dto);
  }

  // IA (AI Controller) — POST /api/v1/ai/upload-activity
  uploadFileForAI(topicId: number, topicName: string, file: File, types: string[]): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('topicName', topicName);
    types.forEach(t => formData.append('types', t));
    return this.http.post(`${environment.apiUrl}/ai/upload-activity`, formData);
  }
}