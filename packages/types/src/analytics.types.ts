// =============================================
// TIPOS DE ANALYTICS - Apphgio Tools
// =============================================

import { UserRole } from './user.types';
import { ToolType } from './tool.types';

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

// ==================== TOOL ANALYTICS ====================
export interface ToolAnalytics {
  toolId: string;
  toolName: string;
  period: AnalyticsPeriod;
  date: Date;

  metrics: {
    views: number;
    uniqueViews: number;
    accesses: number;
    uniqueAccesses: number;
    downloads: number;
    errors: number;
    avgSessionDuration?: number; // segundos
    bounceRate?: number; // porcentaje
  };

  byRole: Record<
    UserRole,
    {
      views: number;
      accesses: number;
    }
  >;

  byHour?: number[]; // 24 elementos, uno por hora
}

// ==================== USER ANALYTICS ====================
export interface UserAnalytics {
  userId: string;
  userEmail: string;
  period: AnalyticsPeriod;
  date: Date;

  metrics: {
    toolsAccessed: number;
    uniqueToolsAccessed: number;
    totalTime?: number; // segundos
    sessionsCount: number;
    errorsEncountered: number;
  };

  topTools: Array<{
    toolId: string;
    toolName: string;
    accessCount: number;
  }>;
}

// ==================== PLATFORM ANALYTICS ====================
export interface PlatformAnalytics {
  period: AnalyticsPeriod;
  date: Date;

  users: {
    total: number;
    active: number;
    new: number;
    byRole: Record<UserRole, number>;
  };

  tools: {
    total: number;
    active: number;
    byType: Record<ToolType, number>;
    byStatus: Record<string, number>;
  };

  access: {
    total: number;
    unique: number;
    byRole: Record<UserRole, number>;
  };

  errors: {
    total: number;
    critical: number;
    resolved: number;
    avgResolutionTime?: number; // horas
  };

  topTools: Array<{
    toolId: string;
    toolName: string;
    accessCount: number;
    uniqueUsers: number;
  }>;

  topUsers: Array<{
    userId: string;
    userName: string;
    accessCount: number;
  }>;
}

// ==================== DASHBOARD STATS ====================
export interface DashboardStats {
  // Contadores principales
  totalUsers: number;
  activeUsers: number;
  totalTools: number;
  activeTools: number;

  // Cambios respecto al periodo anterior
  usersChange: number; // porcentaje
  toolsChange: number;
  accessChange: number;
  errorsChange: number;

  // Accesos
  todayAccess: number;
  weekAccess: number;
  monthAccess: number;

  // Errores
  activeErrors: number;
  criticalErrors: number;

  // Usuarios por rol
  usersByRole: Record<UserRole, number>;

  // Herramientas mas usadas (top 5)
  topTools: Array<{
    id: string;
    name: string;
    icon: string;
    accessCount: number;
  }>;

  // Actividad reciente
  recentActivity: Array<{
    type: 'access' | 'error' | 'user_created' | 'tool_created';
    description: string;
    timestamp: Date;
  }>;
}

// ==================== CHART DATA ====================
export interface ChartDataPoint {
  label: string;
  value: number;
  date?: Date;
}

export interface TimeSeriesData {
  labels: string[];
  datasets: Array<{
    name: string;
    data: number[];
    color?: string;
  }>;
}

export interface AnalyticsFilters {
  period: AnalyticsPeriod;
  dateFrom: Date;
  dateTo: Date;
  toolId?: string;
  userId?: string;
  role?: UserRole;
  type?: ToolType;
}

// ==================== REPORTS ====================
export interface ReportConfig {
  id: string;
  name: string;
  type: 'usage' | 'errors' | 'users' | 'tools' | 'custom';
  period: AnalyticsPeriod;
  filters?: AnalyticsFilters;
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
  createdBy: string;
  createdAt: Date;
}
