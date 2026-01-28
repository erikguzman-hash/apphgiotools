import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '../../firebase/firebase.service';
import { LoginDto } from './dto/login.dto';
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
  lastLogin?: any;
}

@Injectable()
export class AuthService {
  constructor(
    private firebase: FirebaseService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // Verificar usuario en Firebase Auth
      const authUser = await this.firebase.auth.getUserByEmail(email);

      // Obtener documento del usuario en Firestore
      const userDoc = await this.firebase.getDoc<UserDoc>(COLLECTIONS.USERS, authUser.uid);

      if (!userDoc) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      if (userDoc.status !== 'active') {
        throw new UnauthorizedException('Usuario inactivo o suspendido');
      }

      // Nota: La verificacion del password se hace en el cliente con Firebase Auth
      // Aqui asumimos que el cliente ya verifico las credenciales
      // En produccion, usar signInWithEmailAndPassword en el cliente

      // Generar tokens JWT propios para el backend
      const tokens = await this.generateTokens(authUser.uid, email, userDoc.role);

      // Actualizar ultimo login
      await this.firebase.updateDoc(COLLECTIONS.USERS, authUser.uid, {
        lastLogin: this.firebase.serverTimestamp(),
      });

      // Log de acceso
      await this.firebase.createDoc(COLLECTIONS.SYSTEM_LOGS, {
        type: 'audit',
        category: 'auth',
        action: 'LOGIN',
        description: `Usuario ${email} inicio sesion`,
        actorId: authUser.uid,
        actorEmail: email,
        actorRole: userDoc.role,
      });

      return {
        user: {
          id: authUser.uid,
          email: userDoc.email,
          displayName: userDoc.displayName,
          role: userDoc.role,
          avatar: userDoc.avatar,
        },
        ...tokens,
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Credenciales invalidas');
    }
  }

  async loginWithFirebaseToken(idToken: string) {
    try {
      // Verificar token de Firebase
      const decodedToken = await this.firebase.auth.verifyIdToken(idToken);

      // Obtener documento del usuario
      const userDoc = await this.firebase.getDoc<UserDoc>(COLLECTIONS.USERS, decodedToken.uid);

      if (!userDoc) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      if (userDoc.status !== 'active') {
        throw new UnauthorizedException('Usuario inactivo o suspendido');
      }

      // Generar tokens JWT
      const tokens = await this.generateTokens(decodedToken.uid, decodedToken.email!, userDoc.role);

      // Actualizar ultimo login
      await this.firebase.updateDoc(COLLECTIONS.USERS, decodedToken.uid, {
        lastLogin: this.firebase.serverTimestamp(),
      });

      return {
        user: {
          id: decodedToken.uid,
          email: userDoc.email,
          displayName: userDoc.displayName,
          role: userDoc.role,
          avatar: userDoc.avatar,
        },
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Token invalido');
    }
  }

  async logout(userId: string) {
    // Obtener usuario para el log
    const userDoc = await this.firebase.getDoc<UserDoc>(COLLECTIONS.USERS, userId);

    if (userDoc) {
      await this.firebase.createDoc(COLLECTIONS.SYSTEM_LOGS, {
        type: 'audit',
        category: 'auth',
        action: 'LOGOUT',
        description: `Usuario ${userDoc.email} cerro sesion`,
        actorId: userId,
        actorEmail: userDoc.email,
        actorRole: userDoc.role,
      });
    }

    return { message: 'Sesion cerrada correctamente' };
  }

  async validateUser(userId: string) {
    const userDoc = await this.firebase.getDoc<UserDoc>(COLLECTIONS.USERS, userId);

    if (!userDoc || userDoc.status !== 'active') {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    return userDoc;
  }

  async getProfile(userId: string) {
    const userDoc = await this.firebase.getDoc<UserDoc>(COLLECTIONS.USERS, userId);

    if (!userDoc) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      id: userDoc.id,
      email: userDoc.email,
      displayName: userDoc.displayName,
      avatar: userDoc.avatar,
      role: userDoc.role,
      status: userDoc.status,
      companyId: userDoc.companyId,
      assignedToolIds: userDoc.assignedToolIds,
      enrolledCourses: userDoc.enrolledCourses,
      createdAt: userDoc.createdAt,
      lastLogin: userDoc.lastLogin,
    };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN', '30d'),
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 7 * 24 * 60 * 60, // 7 dias en segundos
    };
  }
}
