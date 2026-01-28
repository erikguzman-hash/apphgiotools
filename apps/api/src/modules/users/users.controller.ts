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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear usuario (solo admin)' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  create(@Body() createUserDto: CreateUserDto, @CurrentUser('id') userId: string) {
    return this.usersService.create(createUserDto, userId);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Listar usuarios (solo admin)' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  findAll(@Query() filters: UserFiltersDto) {
    return this.usersService.findAll(filters);
  }

  @Get('stats')
  @Roles('admin')
  @ApiOperation({ summary: 'Estadisticas de usuarios (solo admin)' })
  getStats() {
    return this.usersService.getStats();
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar usuario (solo admin)' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.usersService.update(id, updateUserDto, userId);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar usuario (solo admin)' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.usersService.remove(id, userId);
  }

  @Post(':id/assign-tools')
  @Roles('admin')
  @ApiOperation({ summary: 'Asignar herramientas a usuario' })
  assignTools(
    @Param('id') id: string,
    @Body() body: { toolIds: string[] },
    @CurrentUser('id') userId: string,
  ) {
    return this.usersService.assignTools(id, body.toolIds, userId);
  }
}
