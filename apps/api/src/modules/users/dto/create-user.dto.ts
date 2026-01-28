import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserRole, UserStatus } from '@apphgio/database';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@apphgio.com' })
  @IsEmail({}, { message: 'Email invalido' })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(6, { message: 'La contrasena debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({ example: 'Juan Perez' })
  @IsString()
  @MinLength(2)
  displayName: string;

  @ApiPropertyOptional({ enum: ['admin', 'workspace', 'school', 'client', 'beta', 'free'] })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'suspended', 'pending'] })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedToolIds?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  enrolledCourses?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxToolsAccess?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expirationDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  dailyAccessLimit?: number;
}
