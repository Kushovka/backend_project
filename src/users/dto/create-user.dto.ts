import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional({
    example: 'kirill@example.com',
    description: 'Email пользователя',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'password123',
    description: 'Пароль минимум 6 символов',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 'Kirill', description: 'Имя пользователя' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Kushov',
    description: 'Фамилия пользователя',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'user', description: 'Роль пользователя' })
  @IsOptional()
  @IsString()
  role?: string;
}
