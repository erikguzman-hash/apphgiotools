// =============================================
// TIPOS DE USUARIO - Apphgio Tools
// =============================================

export type UserRole = 'admin' | 'workspace' | 'school' | 'client' | 'beta' | 'free';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;

  // Vinculaciones
  companyId?: string;
  assignedTools: string[]; // IDs de herramientas asignadas (para clientes)
  enrolledCourses: string[]; // IDs de cursos (para escuela)

  // Restricciones (para beta/free)
  restrictions?: UserRestrictions;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  createdBy?: string; // ID del admin que lo creo
}

export interface UserRestrictions {
  maxToolsAccess: number;
  expirationDate?: Date;
  limitedFeatures: string[];
  dailyAccessLimit?: number;
}

export interface CreateUserDto {
  email: string;
  displayName: string;
  password: string;
  role: UserRole;
  companyId?: string;
  assignedTools?: string[];
  enrolledCourses?: string[];
  restrictions?: UserRestrictions;
}

export interface UpdateUserDto {
  displayName?: string;
  avatar?: string;
  role?: UserRole;
  status?: UserStatus;
  companyId?: string;
  assignedTools?: string[];
  enrolledCourses?: string[];
  restrictions?: UserRestrictions;
}

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  companyId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserSession {
  userId: string;
  email: string;
  displayName: string;
  role: UserRole;
  permissions: string[];
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// Permisos por rol
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'users:read',
    'users:write',
    'users:delete',
    'tools:read',
    'tools:write',
    'tools:delete',
    'logs:read',
    'logs:delete',
    'settings:read',
    'settings:write',
    'analytics:read',
  ],
  workspace: ['tools:read', 'tools:access', 'profile:read', 'profile:write'],
  school: ['tools:read', 'tools:access:enrolled', 'profile:read', 'profile:write'],
  client: ['tools:read:assigned', 'tools:access:assigned', 'profile:read', 'profile:write'],
  beta: ['tools:read:beta', 'tools:access:limited', 'profile:read', 'profile:write'],
  free: ['tools:read:free', 'tools:access:limited', 'profile:read'],
};
