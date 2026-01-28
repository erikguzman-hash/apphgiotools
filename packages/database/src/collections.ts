// =============================================
// COLECCIONES DE FIRESTORE - Apphgio Tools
// =============================================

import { db } from './admin';

// Nombres de colecciones
export const COLLECTIONS = {
  USERS: 'users',
  TOOLS: 'tools',
  CATEGORIES: 'categories',
  SECTIONS: 'sections',
  COMPANIES: 'companies',
  ACCESS_LOGS: 'accessLogs',
  ERROR_LOGS: 'errorLogs',
  SYSTEM_LOGS: 'systemLogs',
  SETTINGS: 'settings',
  ANALYTICS: 'analytics',
} as const;

// Referencias a colecciones
export const collections = {
  users: db.collection(COLLECTIONS.USERS),
  tools: db.collection(COLLECTIONS.TOOLS),
  categories: db.collection(COLLECTIONS.CATEGORIES),
  sections: db.collection(COLLECTIONS.SECTIONS),
  companies: db.collection(COLLECTIONS.COMPANIES),
  accessLogs: db.collection(COLLECTIONS.ACCESS_LOGS),
  errorLogs: db.collection(COLLECTIONS.ERROR_LOGS),
  systemLogs: db.collection(COLLECTIONS.SYSTEM_LOGS),
  settings: db.collection(COLLECTIONS.SETTINGS),
  analytics: db.collection(COLLECTIONS.ANALYTICS),
};

// Helper para generar IDs
export const generateId = () => db.collection('_').doc().id;

// Helper para timestamps
export const serverTimestamp = () => require('firebase-admin').firestore.FieldValue.serverTimestamp();
export const increment = (n: number) => require('firebase-admin').firestore.FieldValue.increment(n);
export const arrayUnion = (...elements: any[]) =>
  require('firebase-admin').firestore.FieldValue.arrayUnion(...elements);
export const arrayRemove = (...elements: any[]) =>
  require('firebase-admin').firestore.FieldValue.arrayRemove(...elements);
