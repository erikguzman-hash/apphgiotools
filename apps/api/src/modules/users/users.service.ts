import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { COLLECTIONS } from '@apphgio/database';

interface UserDoc {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: string;
  status: string;
  companyId?: string;
  assignedToolIds: string[];
  enrolledCourses: string[];
  createdAt: any;
  updatedAt: any;
  lastLogin?: any;
  createdBy?: string;
}

@Injectable()
export class UsersService {
  constructor(private firebase: FirebaseService) {}

  async create(createUserDto: CreateUserDto, createdBy?: string) {
    const { email, password, displayName, role = 'free', status = 'active' } = createUserDto;

    try {
      // Verificar si el email ya existe en Firebase Auth
      await this.firebase.auth.getUserByEmail(email);
      throw new ConflictException('El email ya esta registrado');
    } catch (error: any) {
      if (error instanceof ConflictException) throw error;
      // Usuario no existe, continuar con la creacion
    }

    // Crear usuario en Firebase Auth
    const authUser = await this.firebase.auth.createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });

    // Establecer rol en custom claims
    await this.firebase.auth.setCustomUserClaims(authUser.uid, { role });

    // Crear documento en Firestore
    await this.firebase.db.collection(COLLECTIONS.USERS).doc(authUser.uid).set({
      email,
      displayName,
      role,
      status,
      companyId: createUserDto.companyId || null,
      assignedToolIds: createUserDto.assignedToolIds || [],
      enrolledCourses: createUserDto.enrolledCourses || [],
      createdAt: this.firebase.serverTimestamp(),
      updatedAt: this.firebase.serverTimestamp(),
      createdBy: createdBy || null,
    });

    // Log de creacion
    await this.firebase.createDoc(COLLECTIONS.SYSTEM_LOGS, {
      type: 'audit',
      category: 'users',
      action: 'USER_CREATED',
      description: `Usuario ${email} creado`,
      actorId: createdBy,
      targetType: 'user',
      targetId: authUser.uid,
      targetName: email,
    });

    return {
      id: authUser.uid,
      email,
      displayName,
      role,
      status,
    };
  }

  async findAll(filters: UserFiltersDto) {
    const { page = 1, limit = 20, role, status, search } = filters;

    // Construir query
    let query: FirebaseFirestore.Query = this.firebase.db.collection(COLLECTIONS.USERS);

    if (role) {
      query = query.where('role', '==', role);
    }
    if (status) {
      query = query.where('status', '==', status);
    }

    query = query.orderBy('createdAt', 'desc').limit(limit);

    const snapshot = await query.get();
    let users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserDoc[];

    // Filtrar por search en memoria (Firestore no soporta búsqueda de texto)
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(
        u =>
          u.email.toLowerCase().includes(searchLower) ||
          u.displayName.toLowerCase().includes(searchLower)
      );
    }

    const total = await this.firebase.count(COLLECTIONS.USERS);

    return {
      items: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const userDoc = await this.firebase.getDoc<UserDoc>(COLLECTIONS.USERS, id);

    if (!userDoc) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return userDoc;
  }

  async findByEmail(email: string) {
    const users = await this.firebase.query<UserDoc>(COLLECTIONS.USERS, [
      { field: 'email', op: '==', value: email },
    ]);
    return users[0] || null;
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedBy?: string) {
    const user = await this.findOne(id);

    // Actualizar en Firestore
    await this.firebase.updateDoc(COLLECTIONS.USERS, id, updateUserDto);

    // Si se actualiza el rol, actualizar custom claims
    if (updateUserDto.role) {
      await this.firebase.auth.setCustomUserClaims(id, { role: updateUserDto.role });
    }

    // Log de actualizacion
    await this.firebase.createDoc(COLLECTIONS.SYSTEM_LOGS, {
      type: 'audit',
      category: 'users',
      action: 'USER_UPDATED',
      description: `Usuario ${user.email} actualizado`,
      actorId: updatedBy,
      targetType: 'user',
      targetId: id,
      targetName: user.email,
    });

    return this.findOne(id);
  }

  async remove(id: string, deletedBy?: string) {
    const user = await this.findOne(id);

    // Eliminar de Firebase Auth
    await this.firebase.auth.deleteUser(id);

    // Eliminar documento de Firestore
    await this.firebase.deleteDoc(COLLECTIONS.USERS, id);

    // Log de eliminacion
    await this.firebase.createDoc(COLLECTIONS.SYSTEM_LOGS, {
      type: 'audit',
      category: 'users',
      action: 'USER_DELETED',
      description: `Usuario ${user.email} eliminado`,
      actorId: deletedBy,
      targetType: 'user',
      targetId: id,
      targetName: user.email,
    });

    return { message: 'Usuario eliminado correctamente' };
  }

  async assignTools(userId: string, toolIds: string[], assignedBy?: string) {
    const user = await this.findOne(userId);

    await this.firebase.updateDoc(COLLECTIONS.USERS, userId, {
      assignedToolIds: toolIds,
    });

    // Log
    await this.firebase.createDoc(COLLECTIONS.SYSTEM_LOGS, {
      type: 'audit',
      category: 'users',
      action: 'TOOLS_ASSIGNED',
      description: `${toolIds.length} herramientas asignadas a ${user.email}`,
      actorId: assignedBy,
      targetType: 'user',
      targetId: userId,
      targetName: user.email,
    });

    return { message: 'Herramientas asignadas correctamente' };
  }

  async getStats() {
    const usersSnapshot = await this.firebase.db.collection(COLLECTIONS.USERS).get();
    const users = usersSnapshot.docs.map(doc => doc.data()) as UserDoc[];

    const total = users.length;

    // Contar por rol
    const byRole: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    for (const user of users) {
      byRole[user.role] = (byRole[user.role] || 0) + 1;
      byStatus[user.status] = (byStatus[user.status] || 0) + 1;
    }

    // Usuarios recientes
    const recentUsers = users
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5)
      .map(u => ({
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        role: u.role,
        createdAt: u.createdAt,
      }));

    return { total, byRole, byStatus, recentUsers };
  }
}
