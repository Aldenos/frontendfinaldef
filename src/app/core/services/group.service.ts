import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Group, GroupJoinCode, Student } from '../../shared/models/group.model';

@Injectable({ providedIn: 'root' })
export class GroupService {
  private http = inject(HttpClient);

  getMyGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${environment.apiUrl}/groups/mine`);
  }

  getStudentsByGroupCode(code: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${environment.apiUrl}/groups/${code}/students`);
  }

  getGroupByCode(code: string): Observable<Group> {
    return this.http.get<Group>(`${environment.apiUrl}/groups/${code}`);
  }

  createGroup(data: Partial<Group>): Observable<Group> {
    return this.http.post<Group>(`${environment.apiUrl}/groups`, data);
  }

  updateGroup(id: number, data: Partial<Group>): Observable<Group> {
    return this.http.put<Group>(`${environment.apiUrl}/groups/${id}`, data);
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/groups/${id}`);
  }

  enrollStudents(groupCode: string, emails: string[]): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/groups/${groupCode}/enroll`, emails);
  }

  generateJoinCode(groupCode: string): Observable<GroupJoinCode> {
    return this.http.post<GroupJoinCode>(`${environment.apiUrl}/groups/${groupCode}/join-code`, {});
  }
}
