import { Injectable } from '@nestjs/common';
import {
  db,
  auth,
  storage,
  collections,
  generateId,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from '@apphgio/database';
import type { Firestore } from 'firebase-admin/firestore';
import type { Auth } from 'firebase-admin/auth';
import type { Storage } from 'firebase-admin/storage';

@Injectable()
export class FirebaseService {
  // Firestore database
  readonly db: Firestore = db;

  // Firebase Auth
  readonly auth: Auth = auth;

  // Firebase Storage
  readonly storage: Storage = storage;

  // Collection references
  readonly collections = collections;

  // Helpers
  readonly generateId = generateId;
  readonly serverTimestamp = serverTimestamp;
  readonly increment = increment;
  readonly arrayUnion = arrayUnion;
  readonly arrayRemove = arrayRemove;

  // ==================== AUTH HELPERS ====================

  async createUser(email: string, password: string, displayName: string) {
    return this.auth.createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });
  }

  async setUserRole(uid: string, role: string) {
    return this.auth.setCustomUserClaims(uid, { role });
  }

  async verifyIdToken(idToken: string) {
    return this.auth.verifyIdToken(idToken);
  }

  async getUserByEmail(email: string) {
    return this.auth.getUserByEmail(email);
  }

  async deleteAuthUser(uid: string) {
    return this.auth.deleteUser(uid);
  }

  // ==================== FIRESTORE HELPERS ====================

  // Get document by ID
  async getDoc<T>(collection: string, id: string): Promise<T | null> {
    const doc = await this.db.collection(collection).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as T;
  }

  // Get all documents in collection
  async getDocs<T>(collection: string, limit = 100): Promise<T[]> {
    const snapshot = await this.db.collection(collection).limit(limit).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  }

  // Create document
  async createDoc<T>(collection: string, data: Partial<T>, customId?: string): Promise<string> {
    const ref = customId
      ? this.db.collection(collection).doc(customId)
      : this.db.collection(collection).doc();

    await ref.set({
      ...data,
      createdAt: this.serverTimestamp(),
      updatedAt: this.serverTimestamp(),
    });

    return ref.id;
  }

  // Update document
  async updateDoc<T>(collection: string, id: string, data: Partial<T>): Promise<void> {
    await this.db
      .collection(collection)
      .doc(id)
      .update({
        ...data,
        updatedAt: this.serverTimestamp(),
      });
  }

  // Delete document
  async deleteDoc(collection: string, id: string): Promise<void> {
    await this.db.collection(collection).doc(id).delete();
  }

  // Query with filters
  async query<T>(
    collection: string,
    filters: Array<{ field: string; op: FirebaseFirestore.WhereFilterOp; value: any }>,
    options?: { limit?: number; orderBy?: { field: string; direction: 'asc' | 'desc' } }
  ): Promise<T[]> {
    let query: FirebaseFirestore.Query = this.db.collection(collection);

    for (const filter of filters) {
      query = query.where(filter.field, filter.op, filter.value);
    }

    if (options?.orderBy) {
      query = query.orderBy(options.orderBy.field, options.orderBy.direction);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
  }

  // Paginated query
  async paginatedQuery<T>(
    collection: string,
    options: {
      filters?: Array<{ field: string; op: FirebaseFirestore.WhereFilterOp; value: any }>;
      orderBy?: { field: string; direction: 'asc' | 'desc' };
      limit?: number;
      startAfter?: any;
    }
  ): Promise<{ items: T[]; lastDoc: any }> {
    let query: FirebaseFirestore.Query = this.db.collection(collection);

    if (options.filters) {
      for (const filter of options.filters) {
        query = query.where(filter.field, filter.op, filter.value);
      }
    }

    if (options.orderBy) {
      query = query.orderBy(options.orderBy.field, options.orderBy.direction);
    }

    if (options.startAfter) {
      query = query.startAfter(options.startAfter);
    }

    query = query.limit(options.limit || 20);

    const snapshot = await query.get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    return { items, lastDoc };
  }

  // Count documents
  async count(
    collection: string,
    filters?: Array<{ field: string; op: FirebaseFirestore.WhereFilterOp; value: any }>
  ): Promise<number> {
    let query: FirebaseFirestore.Query = this.db.collection(collection);

    if (filters) {
      for (const filter of filters) {
        query = query.where(filter.field, filter.op, filter.value);
      }
    }

    const snapshot = await query.count().get();
    return snapshot.data().count;
  }

  // Batch write
  batch() {
    return this.db.batch();
  }

  // Transaction
  async runTransaction<T>(fn: (transaction: FirebaseFirestore.Transaction) => Promise<T>): Promise<T> {
    return this.db.runTransaction(fn);
  }
}
