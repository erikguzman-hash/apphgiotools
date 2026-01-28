// =============================================
// TIPOS DE API - Apphgio Tools
// =============================================

// ==================== RESPUESTAS API ====================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

// ==================== PAGINACION ====================
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ==================== AUTENTICACION ====================
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    role: string;
    avatar?: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// ==================== BULK OPERATIONS ====================
export interface BulkOperationResult {
  total: number;
  successful: number;
  failed: number;
  errors?: Array<{
    index: number;
    id?: string;
    error: string;
  }>;
}

// ==================== UPLOAD ====================
export interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// ==================== SETTINGS ====================
export interface PlatformSettings {
  general: {
    platformName: string;
    logoUrl: string;
    faviconUrl: string;
    supportEmail: string;
    maintenanceMode: boolean;
    maintenanceMessage?: string;
  };

  access: {
    allowSelfRegistration: boolean;
    defaultRole: string;
    requireEmailVerification: boolean;
    sessionTimeout: number; // minutos
    maxConcurrentSessions: number;
  };

  restrictions: {
    betaMaxTools: number;
    freeMaxTools: number;
    betaExpirationDays: number;
    freeExpirationDays: number;
    dailyAccessLimit: number;
  };

  notifications: {
    emailOnNewUser: boolean;
    emailOnCriticalError: boolean;
    slackWebhook?: string;
    adminEmails: string[];
  };

  appearance: {
    primaryColor: string;
    secondaryColor: string;
    darkModeEnabled: boolean;
  };
}

export interface UpdateSettingsDto extends Partial<PlatformSettings> {}
