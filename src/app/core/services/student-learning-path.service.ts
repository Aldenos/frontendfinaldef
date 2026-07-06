import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LearningPath, SubTopicGap, ConceptualGap } from '../../shared/models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentLearningPathService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getMine(): Observable<LearningPath[]> {
    return this.http.get<LearningPath[]>(`${this.apiUrl}/learning-paths/mine`);
  }

  getAdaptivePath(collectionName: string): Observable<LearningPath> {
    return this.http.get<LearningPath>(`${this.apiUrl}/collections/${encodeURIComponent(collectionName)}/learning-path`);
  }

  getAdaptivePathForTopic(topicId: number): Observable<LearningPath> {
    return this.http.get<LearningPath>(`${this.apiUrl}/topics/${topicId}/learning-path`);
  }

  getGaps(learningPathId: number): Observable<ConceptualGap[]> {
    return this.http.get<ConceptualGap[]>(`${this.apiUrl}/learning-paths/${learningPathId}/gaps`);
  }

  resolveGap(gapId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/learning-paths/gaps/${gapId}/resolve`, {});
  }

  getSubTopicGaps(learningPathId: number): Observable<SubTopicGap[]> {
    return this.http.get<SubTopicGap[]>(`${this.apiUrl}/learning-paths/${learningPathId}/subtopic-gaps`);
  }
}
