import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentGroupService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  joinByCode(code: string): Observable<{ id: number; firstName: string; lastName: string }> {
    return this.http.post<{ id: number; firstName: string; lastName: string }>(`${this.apiUrl}/groups/join`, { code });
  }
}
