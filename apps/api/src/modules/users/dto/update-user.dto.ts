import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['email'] as const)) {
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
