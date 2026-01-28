import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('categories')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ==================== CATEGORIAS ====================
  @Get('categories')
  @ApiOperation({ summary: 'Listar categorias' })
  findAllCategories() {
    return this.categoriesService.findAllCategories();
  }

  @Get('categories/:id')
  findCategoryById(@Param('id') id: string) {
    return this.categoriesService.findCategoryById(id);
  }

  @Post('categories')
  @UseGuards(RolesGuard)
  @Roles('admin')
  createCategory(@Body() data: any) {
    return this.categoriesService.createCategory(data);
  }

  @Patch('categories/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.categoriesService.updateCategory(id, data);
  }

  @Delete('categories/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }

  // ==================== SECCIONES ====================
  @Get('sections')
  @ApiOperation({ summary: 'Listar secciones' })
  findAllSections() {
    return this.categoriesService.findAllSections();
  }

  @Get('sections/:id')
  findSectionById(@Param('id') id: string) {
    return this.categoriesService.findSectionById(id);
  }

  @Post('sections')
  @UseGuards(RolesGuard)
  @Roles('admin')
  createSection(@Body() data: any) {
    return this.categoriesService.createSection(data);
  }

  @Patch('sections/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateSection(@Param('id') id: string, @Body() data: any) {
    return this.categoriesService.updateSection(id, data);
  }

  @Delete('sections/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  deleteSection(@Param('id') id: string) {
    return this.categoriesService.deleteSection(id);
  }
}
