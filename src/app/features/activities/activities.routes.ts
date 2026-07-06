import { Routes } from '@angular/router';

export const ACTIVITIES_ROUTES: Routes = [
  // Ruta intermedia para elegir entre Manual o IA
  { 
    path: 'nueva', 
    loadComponent: () => import('./select-type/select-type.component').then(m => m.SelectTypeComponent) 
  },
  
  // Flujo de creación manual
  { 
    path: 'manual', 
    loadComponent: () => import('./manual/manual-editor/manual-editor.component').then(m => m.ManualEditorComponent) 
  },
  
  // Flujo de creación por IA
  { 
    path: 'ia/subir', 
    loadComponent: () => import('./ai/ai-upload/ai-upload.component').then(m => m.AiUploadComponent) 
  },
  { 
    path: 'ia/procesando', 
    loadComponent: () => import('./ai/ai-progress/ai-progress.component').then(m => m.AiProgressComponent) 
  },
  { 
    path: 'ia/editor', 
    loadComponent: () => import('./ai/ai-editor/ai-editor.component').then(m => m.AiEditorComponent) 
  }
];