import { Routes } from '@angular/router';

export const COURSE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./collections/collection-list/collection-list.component').then(m => m.CollectionListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./collections/collection-detail/collection-detail.component').then(m => m.CollectionDetailComponent)
  },
  {
    path: ':collectionId/temas/:topicId',
    loadComponent: () => import('./topics/topic-activities/topic-activities.component').then(m => m.TopicActivitiesComponent)
  }
];
