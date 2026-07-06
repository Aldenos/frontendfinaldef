import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LearningActivity } from '../../shared/models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentActivityService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getPending(): Observable<LearningActivity[]> {
    return this.http.get<LearningActivity[]>(`${this.apiUrl}/activities/pending`);
  }

  getById(id: number): Observable<LearningActivity> {
    return this.http.get<LearningActivity>(`${this.apiUrl}/activities/${id}`);
  }

  getByTopic(topicId: number): Observable<LearningActivity[]> {
    return this.http.get<LearningActivity[]>(`${this.apiUrl}/topics/${topicId}/activities`);
  }

  getMyResources(): Observable<LearningActivity[]> {
    return this.http.get<LearningActivity[]>(`${this.apiUrl}/my-resources`);
  }

  createPersonalActivity(topicId: number, dto: any): Observable<LearningActivity> {
    return this.http.post<LearningActivity>(`${this.apiUrl}/topics/${topicId}/activities`, {
      ...dto,
      personal: true,
      status: 'PUBLISHED',
      generatedByAi: false
    });
  }
}
