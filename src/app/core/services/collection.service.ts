import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Collection, CollectionCreateDto } from '../../shared/models/collection.model';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${this.apiUrl}/collections`);
  }

  getEnrolled(): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${this.apiUrl}/collections/enrolled`);
  }

  getById(id: number): Observable<Collection> {
    return this.http.get<Collection>(`${this.apiUrl}/collections/${id}`);
  }

  create(dto: CollectionCreateDto): Observable<Collection> {
    return this.http.post<Collection>(`${this.apiUrl}/collections`, dto);
  }

  update(id: number, dto: Partial<CollectionCreateDto>): Observable<Collection> {
    return this.http.put<Collection>(`${this.apiUrl}/collections/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/collections/${id}`);
  }
}
