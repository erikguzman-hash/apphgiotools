import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@apphgio/database';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar usuario
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    // Verificar estado
    if (user.status !== 'active') {
      throw new UnauthorizedException('Usuario inactivo o suspendido');
    }

    // Verificar password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    // Generar tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Guardar refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    // Actualizar ultimo login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Log de acceso
    await this.prisma.systemLog.create({
      data: {
        type: 'audit',
        category: 'auth',
        action: 'LOGIN',
        description: `Usuario ${user.email} inicio sesion`,
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        avatar: user.avatar,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    // Buscar token en BD
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token invalido o expirado');
    }

    // Generar nuevos tokens
    const tokens = await this.generateTokens(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role,
    );

    // Eliminar token viejo y guardar nuevo
    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
    await this.saveRefreshToken(storedToken.user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string, refreshToken?: string) {
    // Eliminar refresh tokens del usuario
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    } else {
      // Eliminar todos los tokens del usuario
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }

    // Log de logout
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await this.prisma.systemLog.create({
        data: {
          type: 'audit',
          category: 'auth',
          action: 'LOGOUT',
          description: `Usuario ${user.email} cerro sesion`,
          actorId: user.id,
          actorEmail: user.email,
          actorRole: user.role,
        },
      });
    }

    return { message: 'Sesion cerrada correctamente' };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    return user;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatar: true,
        role: true,
        status: true,
        companyId: true,
        assignedToolIds: true,
        enrolledCourses: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }

  private async generateTokens(userId: string, email: string, role: UserRole) {
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

  private async saveRefreshToken(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }
}
