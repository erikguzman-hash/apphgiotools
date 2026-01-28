import * as admin from 'firebase-admin';

// Inicializar Firebase Admin SDK
// En produccion usa GOOGLE_APPLICATION_CREDENTIALS
// En desarrollo puedes usar un service account JSON

const getFirebaseAdmin = (): admin.app.App => {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  // Si hay credenciales en variable de entorno (JSON string)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'apphgio.appspot.com',
    });
  }

  // Si hay path a archivo de credenciales
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'apphgio.appspot.com',
    });
  }

  // Desarrollo local con emulador o proyecto default
  return admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'apphgio',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'apphgio.appspot.com',
  });
};

export const firebaseAdmin = getFirebaseAdmin();
export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();
export const storage = firebaseAdmin.storage();

// Configurar Firestore
db.settings({
  ignoreUndefinedProperties: true,
});

export { admin };
export default db;
