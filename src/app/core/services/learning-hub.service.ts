import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StudentLearningPath } from '../../shared/models/learning-gap.model';

@Injectable({ providedIn: 'root' })
export class LearningHubService {
  private http = inject(HttpClient);

  getLearningPathsByGroup(groupCode: string): Observable<StudentLearningPath[]> {
    return this.http.get<StudentLearningPath[]>(
      `${environment.apiUrl}/groups/${groupCode}/learning-paths`
    );
  }
}
