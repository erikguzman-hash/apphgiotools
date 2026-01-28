// =============================================
// CONSTANTES DE LA APLICACION - Apphgio Tools
// =============================================

// ==================== ROLES ====================
export const USER_ROLES = {
  ADMIN: 'admin',
  WORKSPACE: 'workspace',
  SCHOOL: 'school',
  CLIENT: 'client',
  BETA: 'beta',
  FREE: 'free',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  workspace: 'Workspace',
  school: 'Escuela de Excelencia',
  client: 'Cliente',
  beta: 'Beta',
  free: 'Free',
};

export const ROLE_COLORS: Record<string, string> = {
  admin: '#dc2626',
  workspace: '#2563eb',
  school: '#7c3aed',
  client: '#059669',
  beta: '#d97706',
  free: '#6b7280',
};

// ==================== TOOL TYPES ====================
export const TOOL_TYPES = {
  WEB_APP: 'web-app',
  DESKTOP_APP: 'desktop-app',
  MOBILE_APP: 'mobile-app',
  API: 'api',
  SCRIPT: 'script',
  TEMPLATE: 'template',
  RESOURCE: 'resource',
  DOCUMENTATION: 'documentation',
} as const;

export const TOOL_TYPE_LABELS: Record<string, string> = {
  'web-app': 'Aplicacion Web',
  'desktop-app': 'Aplicacion Escritorio',
  'mobile-app': 'Aplicacion Movil',
  api: 'API',
  script: 'Script',
  template: 'Plantilla',
  resource: 'Recurso',
  documentation: 'Documentacion',
};

export const TOOL_TYPE_ICONS: Record<string, string> = {
  'web-app': 'Globe',
  'desktop-app': 'Monitor',
  'mobile-app': 'Smartphone',
  api: 'Code',
  script: 'Terminal',
  template: 'FileText',
  resource: 'FolderOpen',
  documentation: 'BookOpen',
};

// ==================== TOOL STATUS ====================
export const TOOL_STATUS = {
  ACTIVE: 'active',
  BETA: 'beta',
  MAINTENANCE: 'maintenance',
  DEPRECATED: 'deprecated',
  COMING_SOON: 'coming-soon',
} as const;

export const TOOL_STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  beta: 'Beta',
  maintenance: 'Mantenimiento',
  deprecated: 'Obsoleto',
  'coming-soon': 'Proximamente',
};

export const TOOL_STATUS_COLORS: Record<string, string> = {
  active: '#22c55e',
  beta: '#eab308',
  maintenance: '#f97316',
  deprecated: '#ef4444',
  'coming-soon': '#3b82f6',
};

// ==================== ERROR TYPES ====================
export const ERROR_TYPES = {
  AUTH_ERROR: 'auth_error',
  ACCESS_DENIED: 'access_denied',
  TOOL_UNAVAILABLE: 'tool_unavailable',
  API_ERROR: 'api_error',
  VALIDATION_ERROR: 'validation_error',
  SYSTEM_ERROR: 'system_error',
  INTEGRATION_ERROR: 'integration_error',
  DATABASE_ERROR: 'database_error',
  UNKNOWN: 'unknown',
} as const;

export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const ERROR_STATUS = {
  NEW: 'new',
  ACKNOWLEDGED: 'acknowledged',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  IGNORED: 'ignored',
} as const;

// ==================== PAGINATION ====================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ==================== API ====================
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',

  // Users
  USERS: '/users',
  USER: (id: string) => `/users/${id}`,

  // Tools
  TOOLS: '/tools',
  TOOL: (id: string) => `/tools/${id}`,
  TOOL_ACCESS: (id: string) => `/tools/${id}/access`,

  // Categories
  CATEGORIES: '/categories',
  CATEGORY: (id: string) => `/categories/${id}`,

  // Sections
  SECTIONS: '/sections',
  SECTION: (id: string) => `/sections/${id}`,

  // Logs
  ACCESS_LOGS: '/logs/access',
  ERROR_LOGS: '/logs/errors',
  SYSTEM_LOGS: '/logs/system',

  // Analytics
  ANALYTICS_DASHBOARD: '/analytics/dashboard',
  ANALYTICS_TOOLS: '/analytics/tools',
  ANALYTICS_USERS: '/analytics/users',

  // Settings
  SETTINGS: '/settings',
} as const;

// ==================== RESTRICTIONS ====================
export const DEFAULT_RESTRICTIONS = {
  BETA: {
    maxToolsAccess: 5,
    expirationDays: 30,
    dailyAccessLimit: 10,
  },
  FREE: {
    maxToolsAccess: 3,
    expirationDays: 14,
    dailyAccessLimit: 5,
  },
} as const;
