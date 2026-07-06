import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenSvc = inject(TokenService);
  private apiUrl = `${environment.apiUrl}/auth`;

  register(dto: { firstName: string; lastName: string; email: string; password: string; roleName: string }): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, dto, { responseType: 'text' });
  }

  login(email: string, password: string): Observable<{ token: string; user: User }> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { responseType: 'text' })
      .pipe(
        map((token: string) => ({ token })),
        switchMap(({ token }) => {
          this.tokenSvc.saveToken(token);
          // Obtenemos el usuario autenticado desde /users/me
          return this.http.get<User>(`${environment.apiUrl}/users/me`).pipe(
            tap(user => this.tokenSvc.saveUser({ ...user, role: user.roleName })),
            map(user => ({ token, user: { ...user, role: user.roleName } }))
          );
        })
      );
  }

  logout(): void {
    this.tokenSvc.clear();
  }

  isLoggedIn(): boolean {
    return !!this.tokenSvc.getToken();
  }

  getUser(): User | null {
    return this.tokenSvc.getUser();
  }
}