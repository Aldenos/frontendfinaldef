import { Injectable, signal } from '@angular/core';

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private readonly breadcrumbItems = signal<BreadcrumbItem[]>([]);

  items = this.breadcrumbItems.asReadonly();

  setItems(items: BreadcrumbItem[]): void {
    this.breadcrumbItems.set(items);
  }

  clear(): void {
    this.breadcrumbItems.set([]);
  }
}