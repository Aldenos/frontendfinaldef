import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PendingUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roleName?: string;
  role?: string;
  status?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getPendingUsers(): Observable<PendingUser[]> {
    return this.http.get<PendingUser[]>(`${this.apiUrl}/admin/pending`);
  }

  approveUser(userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/admin/approve/${userId}`, {});
  }

  rejectUser(userId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/admin/reject/${userId}`, {});
  }

  verifyCode(email: string, code: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/admin/verify-code`, { email, code });
  }
}