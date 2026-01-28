import { z } from 'zod';

// =============================================
// SCHEMA DE VARIABLES DE ENTORNO
// =============================================

const envSchema = z.object({
  // General
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: z.string().url().default('http://localhost:3000'),
  ADMIN_URL: z.string().url().default('http://localhost:3001'),
  API_URL: z.string().url().default('http://localhost:4000'),

  // Supabase (PostgreSQL)
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),

  // MongoDB
  MONGODB_URI: z.string().optional(),

  // JWT
  JWT_SECRET: z.string().min(32).default('change-this-secret-in-production-min-32-chars'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_TOKEN_SECRET: z
    .string()
    .min(32)
    .default('change-this-refresh-secret-in-production-min-32'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),

  // Redis (opcional)
  REDIS_URL: z.string().optional(),

  // Email (opcional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Storage
  STORAGE_BUCKET: z.string().default('apphgio-tools-storage'),
});

export type Env = z.infer<typeof envSchema>;

// Validar y obtener variables de entorno
export function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

// Singleton para evitar multiples validaciones
let env: Env | null = null;

export function env(): Env {
  if (!env) {
    env = getEnv();
  }
  return env;
}

// Helper para verificar si estamos en produccion
export const isProduction = () => process.env.NODE_ENV === 'production';
export const isDevelopment = () => process.env.NODE_ENV === 'development';
export const isTest = () => process.env.NODE_ENV === 'test';
