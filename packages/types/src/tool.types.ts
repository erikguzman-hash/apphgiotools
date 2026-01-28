// =============================================
// TIPOS DE HERRAMIENTAS - Apphgio Tools
// =============================================

import { UserRole } from './user.types';

export type ToolType =
  | 'web-app'
  | 'desktop-app'
  | 'mobile-app'
  | 'api'
  | 'script'
  | 'template'
  | 'resource'
  | 'documentation';

export type ToolStatus = 'active' | 'beta' | 'maintenance' | 'deprecated' | 'coming-soon';

export type AccessType = 'redirect' | 'embed' | 'download' | 'api-key';

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;

  // Clasificacion
  categoryId: string;
  sectionId: string;
  type: ToolType;
  tags: string[];

  // Acceso
  accessUrl: string;
  accessType: AccessType;
  embedConfig?: EmbedConfig;

  // Media
  icon: string;
  screenshots: string[];
  videoUrl?: string;
  documentation?: string;

  // Estado
  status: ToolStatus;
  version: string;

  // Permisos
  allowedRoles: UserRole[];
  relatedCourses: string[]; // Para usuarios de escuela
  requiresApproval: boolean;

  // Restricciones para beta/free
  restrictions?: ToolRestrictions;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;

  // Stats (denormalizados para performance)
  stats: ToolStats;
}

export interface EmbedConfig {
  width?: string;
  height?: string;
  allowFullscreen?: boolean;
  sandbox?: string[];
}

export interface ToolRestrictions {
  maxUses?: number;
  maxUsesPerDay?: number;
  limitedFeatures?: string[];
  requiresApproval?: boolean;
  expirationDays?: number;
}

export interface ToolStats {
  totalAccess: number;
  uniqueUsers: number;
  lastAccessed?: Date;
  avgRating?: number;
  totalRatings?: number;
}

export interface CreateToolDto {
  name: string;
  description: string;
  longDescription?: string;
  categoryId: string;
  sectionId: string;
  type: ToolType;
  tags?: string[];
  accessUrl: string;
  accessType: AccessType;
  embedConfig?: EmbedConfig;
  icon?: string;
  screenshots?: string[];
  videoUrl?: string;
  documentation?: string;
  status?: ToolStatus;
  version?: string;
  allowedRoles: UserRole[];
  relatedCourses?: string[];
  requiresApproval?: boolean;
  restrictions?: ToolRestrictions;
}

export interface UpdateToolDto extends Partial<CreateToolDto> {
  updatedBy: string;
}

export interface ToolFilters {
  categoryId?: string;
  sectionId?: string;
  type?: ToolType;
  status?: ToolStatus;
  allowedRoles?: UserRole[];
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// Card para mostrar en el catalogo
export interface ToolCard {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  type: ToolType;
  status: ToolStatus;
  categoryName: string;
  sectionName: string;
  stats: Pick<ToolStats, 'totalAccess' | 'avgRating'>;
}
