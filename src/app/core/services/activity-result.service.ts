import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActivityResult, ActivityResultDetail, ActivityResultSubmitDto, TimelinePoint } from '../../shared/models/student.model';

@Injectable({ providedIn: 'root' })
export class ActivityResultService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getMine(type?: string, topicId?: number, sort?: string): Observable<ActivityResult[]> {
    let params = '';
    const query: string[] = [];
    if (type) query.push(`type=${encodeURIComponent(type)}`);
    if (topicId) query.push(`topicId=${topicId}`);
    if (sort) query.push(`sort=${encodeURIComponent(sort)}`);
    if (query.length) params = `?${query.join('&')}`;
    return this.http.get<ActivityResult[]>(`${this.apiUrl}/results/mine${params}`);
  }

  getTimeline(topicId?: number): Observable<TimelinePoint[]> {
    const params = topicId ? `?topicId=${topicId}` : '';
    return this.http.get<TimelinePoint[]>(`${this.apiUrl}/results/mine/timeline${params}`);
  }

  getResultDetail(resultId: number): Observable<ActivityResultDetail> {
    return this.http.get<ActivityResultDetail>(`${this.apiUrl}/results/${resultId}`);
  }

  submit(topicName: string, activityTitle: string, dto: ActivityResultSubmitDto): Observable<ActivityResultDetail> {
    return this.http.post<ActivityResultDetail>(
      `${this.apiUrl}/topics/${encodeURIComponent(topicName)}/activities/${encodeURIComponent(activityTitle)}/submit`,
      dto
    );
  }
}
