import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // ==================== CATEGORIAS ====================
  async findAllCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Categoria no encontrada');
    return category;
  }

  async createCategory(data: any) {
    return this.prisma.category.create({
      data: {
        ...data,
        slug: this.generateSlug(data.name),
      },
    });
  }

  async updateCategory(id: string, data: any) {
    await this.findCategoryById(id);
    return this.prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    await this.findCategoryById(id);
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Categoria eliminada' };
  }

  // ==================== SECCIONES ====================
  async findAllSections() {
    return this.prisma.section.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findSectionById(id: string) {
    const section = await this.prisma.section.findUnique({ where: { id } });
    if (!section) throw new NotFoundException('Seccion no encontrada');
    return section;
  }

  async createSection(data: any) {
    return this.prisma.section.create({
      data: {
        ...data,
        slug: this.generateSlug(data.name),
      },
    });
  }

  async updateSection(id: string, data: any) {
    await this.findSectionById(id);
    return this.prisma.section.update({ where: { id }, data });
  }

  async deleteSection(id: string) {
    await this.findSectionById(id);
    await this.prisma.section.delete({ where: { id } });
    return { message: 'Seccion eliminada' };
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
}
