import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@apphgio/database';

@Injectable()
export class ToolsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: any = {}) {
    const { page = 1, limit = 20, categoryId, sectionId, type, status, search } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (sectionId) where.sectionId = sectionId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tools, total] = await Promise.all([
      this.prisma.tool.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          section: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tool.count({ where }),
    ]);

    return {
      items: tools,
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

  async findAllForUser(userId: string, userRole: UserRole, filters: any = {}) {
    // Obtener usuario con sus asignaciones
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { assignedToolIds: true, enrolledCourses: true },
    });

    const baseWhere: any = { status: 'active' };

    // Filtrar segun rol
    switch (userRole) {
      case 'admin':
      case 'workspace':
        // Acceso total
        break;
      case 'school':
        // Solo herramientas de sus cursos
        baseWhere.OR = [
          { allowedRoles: { has: 'school' } },
          { relatedCourses: { hasSome: user?.enrolledCourses || [] } },
        ];
        break;
      case 'client':
        // Solo herramientas asignadas
        baseWhere.id = { in: user?.assignedToolIds || [] };
        break;
      case 'beta':
        baseWhere.allowedRoles = { has: 'beta' };
        break;
      case 'free':
        baseWhere.allowedRoles = { has: 'free' };
        break;
    }

    return this.findAll({ ...filters, ...baseWhere });
  }

  async findOne(id: string) {
    const tool = await this.prisma.tool.findUnique({
      where: { id },
      include: {
        category: true,
        section: true,
        createdBy: { select: { id: true, displayName: true } },
      },
    });

    if (!tool) {
      throw new NotFoundException('Herramienta no encontrada');
    }

    return tool;
  }

  async create(data: any, createdById: string) {
    const tool = await this.prisma.tool.create({
      data: {
        ...data,
        slug: this.generateSlug(data.name),
        createdById,
        updatedById: createdById,
      },
    });

    // Actualizar contador de categoria y seccion
    await Promise.all([
      this.prisma.category.update({
        where: { id: data.categoryId },
        data: { toolCount: { increment: 1 } },
      }),
      this.prisma.section.update({
        where: { id: data.sectionId },
        data: { toolCount: { increment: 1 } },
      }),
    ]);

    return tool;
  }

  async update(id: string, data: any, updatedById: string) {
    const tool = await this.findOne(id);

    return this.prisma.tool.update({
      where: { id },
      data: {
        ...data,
        updatedById,
      },
    });
  }

  async remove(id: string) {
    const tool = await this.findOne(id);

    await this.prisma.tool.delete({ where: { id } });

    // Actualizar contadores
    await Promise.all([
      this.prisma.category.update({
        where: { id: tool.categoryId },
        data: { toolCount: { decrement: 1 } },
      }),
      this.prisma.section.update({
        where: { id: tool.sectionId },
        data: { toolCount: { decrement: 1 } },
      }),
    ]);

    return { message: 'Herramienta eliminada' };
  }

  async logAccess(toolId: string, userId: string, action: string = 'access') {
    const [tool, user] = await Promise.all([
      this.prisma.tool.findUnique({ where: { id: toolId } }),
      this.prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!tool || !user) return;

    await this.prisma.accessLog.create({
      data: {
        toolId,
        toolName: tool.name,
        userId,
        userEmail: user.email,
        userName: user.displayName,
        userRole: user.role,
        action: action as any,
        success: true,
      },
    });

    // Actualizar stats de la herramienta
    await this.prisma.tool.update({
      where: { id: toolId },
      data: {
        totalAccess: { increment: 1 },
        lastAccessed: new Date(),
      },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
