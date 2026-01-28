import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, createdBy?: string) {
    // Verificar si el email ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya esta registrado');
    }

    // Hash del password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        createdBy,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // Log de creacion
    await this.prisma.systemLog.create({
      data: {
        type: 'audit',
        category: 'users',
        action: 'USER_CREATED',
        description: `Usuario ${user.email} creado`,
        actorId: createdBy,
        targetType: 'user',
        targetId: user.id,
        targetName: user.email,
      },
    });

    return user;
  }

  async findAll(filters: UserFiltersDto) {
    const { page = 1, limit = 20, role, status, search, companyId } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (role) where.role = role;
    if (status) where.status = status;
    if (companyId) where.companyId = companyId;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          displayName: true,
          avatar: true,
          role: true,
          status: true,
          companyId: true,
          lastLogin: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

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
    const user = await this.prisma.user.findUnique({
      where: { id },
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
        maxToolsAccess: true,
        expirationDate: true,
        dailyAccessLimit: true,
        limitedFeatures: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedBy?: string) {
    const user = await this.findOne(id);

    // Si se actualiza el password, hashearlo
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    // Log de actualizacion
    await this.prisma.systemLog.create({
      data: {
        type: 'audit',
        category: 'users',
        action: 'USER_UPDATED',
        description: `Usuario ${user.email} actualizado`,
        actorId: updatedBy,
        targetType: 'user',
        targetId: user.id,
        targetName: user.email,
        previousValue: user as any,
        newValue: updatedUser as any,
      },
    });

    return updatedUser;
  }

  async remove(id: string, deletedBy?: string) {
    const user = await this.findOne(id);

    await this.prisma.user.delete({ where: { id } });

    // Log de eliminacion
    await this.prisma.systemLog.create({
      data: {
        type: 'audit',
        category: 'users',
        action: 'USER_DELETED',
        description: `Usuario ${user.email} eliminado`,
        actorId: deletedBy,
        targetType: 'user',
        targetId: id,
        targetName: user.email,
      },
    });

    return { message: 'Usuario eliminado correctamente' };
  }

  async assignTools(userId: string, toolIds: string[], assignedBy?: string) {
    const user = await this.findOne(userId);

    await this.prisma.user.update({
      where: { id: userId },
      data: { assignedToolIds: toolIds },
    });

    // Log
    await this.prisma.systemLog.create({
      data: {
        type: 'audit',
        category: 'users',
        action: 'TOOLS_ASSIGNED',
        description: `${toolIds.length} herramientas asignadas a ${user.email}`,
        actorId: assignedBy,
        targetType: 'user',
        targetId: userId,
        targetName: user.email,
        newValue: { toolIds } as any,
      },
    });

    return { message: 'Herramientas asignadas correctamente' };
  }

  async getStats() {
    const [total, byRole, byStatus, recentUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      this.prisma.user.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          displayName: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      total,
      byRole: Object.fromEntries(byRole.map(r => [r.role, r._count])),
      byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count])),
      recentUsers,
    };
  }
}
