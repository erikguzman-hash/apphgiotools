import { IsOptional, IsEnum, IsString, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserRole, UserStatus } from '@apphgio/database';

export class UserFiltersDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}
