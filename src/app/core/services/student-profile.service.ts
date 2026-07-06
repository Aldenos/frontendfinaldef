import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StudentProfile {
  userId: number;
  studentId: number | null;
  email: string;
  firstName: string;
  lastName: string;
  verified: boolean;
}

interface StudentRow { id: number; firstName: string; lastName: string; userId: number; }
interface MeRow { id: number; email: string; verified: boolean; }

@Injectable({ providedIn: 'root' })
export class StudentProfileService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getMyProfile(): Observable<StudentProfile> {
    return forkJoin({
      me: this.http.get<MeRow>(`${this.apiUrl}/users/me`),
      students: this.http.get<StudentRow[]>(`${this.apiUrl}/students`)
    }).pipe(
      map(({ me, students }) => {
        const match = students.find(s => s.userId === me.id);
        return {
          userId: me.id,
          studentId: match?.id ?? null,
          email: me.email,
          firstName: match?.firstName ?? '',
          lastName: match?.lastName ?? '',
          verified: me.verified
        };
      })
    );
  }
}
