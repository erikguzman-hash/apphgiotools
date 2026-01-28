// =============================================
// FIREBASE CLIENT CONFIG - Apphgio Tools
// =============================================

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Obtener config desde variables de entorno
export function getFirebaseConfig(): FirebaseConfig {
  const config: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'apphgio',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  return config;
}

// Constantes de Storage
export const STORAGE_PATHS = {
  PUBLIC: 'public',
  TOOLS: 'tools',
  SCREENSHOTS: 'screenshots',
  AVATARS: 'avatars',
  PRIVATE: 'private',
} as const;

// Helper para construir paths de storage
export const getStoragePath = {
  toolIcon: (toolId: string, filename: string) => `${STORAGE_PATHS.TOOLS}/${toolId}/${filename}`,
  screenshot: (toolId: string, filename: string) =>
    `${STORAGE_PATHS.SCREENSHOTS}/${toolId}/${filename}`,
  avatar: (userId: string, filename: string) => `${STORAGE_PATHS.AVATARS}/${userId}/${filename}`,
  public: (filename: string) => `${STORAGE_PATHS.PUBLIC}/${filename}`,
};
