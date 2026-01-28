import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ToolsService } from './tools.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('tools')
@Controller('tools')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar herramientas segun rol del usuario' })
  findAll(@Query() filters: any, @CurrentUser() user: any) {
    if (user.role === 'admin') {
      return this.toolsService.findAll(filters);
    }
    return this.toolsService.findAllForUser(user.id, user.role, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener herramienta por ID' })
  findOne(@Param('id') id: string) {
    return this.toolsService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Crear herramienta (solo admin)' })
  create(@Body() createToolDto: any, @CurrentUser('id') userId: string) {
    return this.toolsService.create(createToolDto, userId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar herramienta (solo admin)' })
  update(
    @Param('id') id: string,
    @Body() updateToolDto: any,
    @CurrentUser('id') userId: string,
  ) {
    return this.toolsService.update(id, updateToolDto, userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar herramienta (solo admin)' })
  remove(@Param('id') id: string) {
    return this.toolsService.remove(id);
  }

  @Post(':id/access')
  @ApiOperation({ summary: 'Registrar acceso a herramienta' })
  logAccess(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.toolsService.logAccess(id, userId);
  }
}
