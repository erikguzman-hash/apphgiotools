// =============================================
// TIPOS DE LOGS Y ERRORES - Apphgio Tools
// =============================================

import { UserRole } from './user.types';

// ==================== ACCESS LOGS ====================
export type AccessAction = 'view' | 'access' | 'download' | 'api_call' | 'embed_load';

export interface AccessLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userRole: UserRole;

  toolId: string;
  toolName: string;

  action: AccessAction;

  // Contexto
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  sessionId?: string;

  // Resultado
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  responseTime?: number; // ms

  timestamp: Date;
}

export interface AccessLogFilters {
  userId?: string;
  toolId?: string;
  action?: AccessAction;
  success?: boolean;
  userRole?: UserRole;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

// ==================== ERROR LOGS ====================
export type ErrorType =
  | 'auth_error'
  | 'access_denied'
  | 'tool_unavailable'
  | 'api_error'
  | 'validation_error'
  | 'system_error'
  | 'integration_error'
  | 'database_error'
  | 'unknown';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ErrorStatus = 'new' | 'acknowledged' | 'investigating' | 'resolved' | 'ignored';

export interface ErrorLog {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;

  // Contexto
  userId?: string;
  userEmail?: string;
  toolId?: string;
  toolName?: string;
  endpoint?: string;
  method?: string;

  // Detalles del error
  code: string;
  message: string;
  stack?: string;
  metadata?: Record<string, unknown>;

  // Estado de gestion
  status: ErrorStatus;
  assignedTo?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
  notes?: string[];

  timestamp: Date;
  updatedAt?: Date;
}

export interface CreateErrorLogDto {
  type: ErrorType;
  severity: ErrorSeverity;
  code: string;
  message: string;
  stack?: string;
  userId?: string;
  toolId?: string;
  endpoint?: string;
  method?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateErrorLogDto {
  status?: ErrorStatus;
  assignedTo?: string;
  resolution?: string;
  notes?: string[];
}

export interface ErrorLogFilters {
  type?: ErrorType;
  severity?: ErrorSeverity;
  status?: ErrorStatus;
  userId?: string;
  toolId?: string;
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

// ==================== SYSTEM/AUDIT LOGS ====================
export type SystemLogType = 'info' | 'warning' | 'error' | 'audit' | 'security';

export type SystemLogCategory =
  | 'auth'
  | 'users'
  | 'tools'
  | 'categories'
  | 'sections'
  | 'settings'
  | 'system';

export interface SystemLog {
  id: string;
  type: SystemLogType;
  category: SystemLogCategory;

  action: string;
  description: string;

  // Actor (quien realizo la accion)
  actorId?: string;
  actorEmail?: string;
  actorRole?: UserRole;

  // Target (sobre que se realizo)
  targetType?: 'user' | 'tool' | 'category' | 'section' | 'setting';
  targetId?: string;
  targetName?: string;

  // Cambios
  previousValue?: unknown;
  newValue?: unknown;

  // Contexto
  ipAddress?: string;
  userAgent?: string;

  timestamp: Date;
}

export interface SystemLogFilters {
  type?: SystemLogType;
  category?: SystemLogCategory;
  actorId?: string;
  targetType?: string;
  targetId?: string;
  action?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

// ==================== LOG SUMMARY ====================
export interface LogSummary {
  totalAccess: number;
  totalErrors: number;
  criticalErrors: number;
  unresolvedErrors: number;
  activeUsers: number;
  mostAccessedTools: Array<{ toolId: string; toolName: string; count: number }>;
  errorsByType: Record<ErrorType, number>;
  accessByRole: Record<UserRole, number>;
}
