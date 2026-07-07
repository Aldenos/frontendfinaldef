import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StudentLearningPath } from '../../shared/models/learning-gap.model';

export interface GroupStatistic {
  groupCode: string;
  groupName: string;
  topicAverageMap: Record<string, number>;
}

export interface SubTopicGap {
  subTopicName: string;
  topicName: string;
  errorRate: number;
  totalQuestions: number;
  incorrectAnswers: number;
}

@Injectable({ providedIn: 'root' })
export class LearningHubService {
  private http = inject(HttpClient);

  getLearningPathsByGroup(groupCode: string): Observable<StudentLearningPath[]> {
    return this.http.get<StudentLearningPath[]>(
      `${environment.apiUrl}/groups/${groupCode}/learning-paths`
    );
  }

  getGroupsStatistics(collectionName: string): Observable<GroupStatistic[]> {
    return this.http.get<GroupStatistic[]>(
      `${environment.apiUrl}/collections/${encodeURIComponent(collectionName)}/groups-statistics`
    );
  }

  getSubTopicGapsByGroup(groupCode: string): Observable<SubTopicGap[]> {
    return this.http.get<SubTopicGap[]>(`${environment.apiUrl}/groups/${groupCode}/subtopics-gaps`);
  }
}
