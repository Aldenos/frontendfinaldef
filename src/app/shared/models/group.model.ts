export interface Group {
  id: number;
  name: string;
  code: string;           // 'CC23', 'SI34'
  studentsCount?: number;
  collectionId?: number;  // Si está vinculado a una colección
  createdAt?: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  avgScore?: number;
  completedActivities?: number;
}