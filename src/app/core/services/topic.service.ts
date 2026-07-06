import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Topic, TopicCreateDto } from '../../shared/models/topic.model';

@Injectable({ providedIn: 'root' })
export class TopicService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getByCollection(collectionName: string): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.apiUrl}/collections/${encodeURIComponent(collectionName)}/topics`);
  }

  getById(topicId: number): Observable<Topic> {
    return this.http.get<Topic>(`${this.apiUrl}/topics/${topicId}`);
  }

  create(collectionName: string, dto: TopicCreateDto): Observable<Topic> {
    return this.http.post<Topic>(`${this.apiUrl}/collections/${encodeURIComponent(collectionName)}/topics`, dto);
  }

  update(topicId: number, dto: Partial<TopicCreateDto>): Observable<Topic> {
    return this.http.put<Topic>(`${this.apiUrl}/topics/${topicId}`, dto);
  }

  delete(topicId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/topics/${topicId}`);
  }
}
