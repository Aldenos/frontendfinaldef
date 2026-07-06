import { Routes } from '@angular/router';

export const STUDENT_APP_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/student-dashboard.component').then(m => m.StudentDashboardHomeComponent)
  },
  {
    path: 'codex',
    loadComponent: () => import('./codex/codex-list.component').then(m => m.CodexListComponent)
  },
  {
    path: 'codex/:collectionName',
    loadComponent: () => import('./codex/codex-collection.component').then(m => m.CodexCollectionComponent)
  },
  {
    path: 'codex/:collectionName/temas/:topicId',
    loadComponent: () => import('./codex/codex-topic.component').then(m => m.CodexTopicComponent)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./profile/student-profile.component').then(m => m.StudentProfilePageComponent)
  },
  {
    path: 'historial',
    loadComponent: () => import('./history/student-history.component').then(m => m.StudentHistoryComponent)
  },
  {
    path: 'comunidad',
    loadComponent: () => import('./community/community.component').then(m => m.CommunityComponent)
  },
  {
    path: 'comunidad/:topicName',
    loadComponent: () => import('./community/community-forum.component').then(m => m.CommunityForumComponent)
  },

  {
    path: 'mis-recursos',
    loadComponent: () => import('./mis-recursos/mis-recursos.component').then(m => m.MisRecursosComponent)
  },

  // Pantallas de actividad (modo focus, sin navbar completo)
  {
    path: 'quiz/:activityId',
    data: { focus: true },
    loadComponent: () => import('./quiz/quiz-player.component').then(m => m.QuizPlayerComponent)
  },
  {
    path: 'flashcards/:topicId',
    data: { focus: true },
    loadComponent: () => import('./flashcards/flashcard-session.component').then(m => m.FlashcardSessionComponent)
  },
  {
    path: 'feynman/:topicId',
    data: { focus: true },
    loadComponent: () => import('./feynman/feynman-canvas.component').then(m => m.FeynmanCanvasComponent)
  },
  {
    path: 'resultados/:resultId',
    data: { focus: true },
    loadComponent: () => import('./feedback/activity-feedback.component').then(m => m.ActivityFeedbackComponent)
  }
];
