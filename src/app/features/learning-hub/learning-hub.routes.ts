import { Routes } from '@angular/router';

export const LEARNING_HUB_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./hub/learning-hub.component').then(m => m.LearningHubComponent)
  }
];