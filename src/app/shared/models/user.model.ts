// src/app/shared/models/user.model.ts
export interface User {
  id: number;
  email: string;
  firstName?: string;        
  lastName?: string;
  roleName: 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE';
  // Some parts of the app expect `role` and `name` fields — keep them optional
  role?: string;
  name?: string;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED';
  verified: boolean;
  createdAt: string;
}

// DTO para el registro 
export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleName: 'DOCENTE' | 'ESTUDIANTE';  // El admin se crea manualmente
}

// DTO para el login 
export interface LoginDto {
  email: string;
  password: string;
}

// Respuesta del login (adaptado: el backend devuelve string, luego obtenemos usuario de /me)
export interface AuthResponse {
  token: string;
  user: User;
}

// Para el panel de admin (usuarios pendientes)
export interface PendingUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  createdAt: string;
}