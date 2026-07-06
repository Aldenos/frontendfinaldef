import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Group } from '../../shared/models/group.model';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private http = inject(HttpClient);

  getMyGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${environment.apiUrl}/groups/my-groups`);
  }

  getGroupByCode(code: string): Observable<Group> {
    return this.http.get<Group>(`${environment.apiUrl}/groups/${code}`);
  }

  createGroup(data: Partial<Group>): Observable<Group> {
    return this.http.post<Group>(`${environment.apiUrl}/groups`, data);
  }

  updateGroup(code: string, data: Partial<Group>): Observable<Group> {
    return this.http.put<Group>(`${environment.apiUrl}/groups/${code}`, data);
  }

  deleteGroup(code: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/groups/${code}`);
  }

  enrollStudents(groupCode: string, emails: string[]): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/groups/${groupCode}/enroll`, emails);
  }
}
