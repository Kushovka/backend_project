import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop', description: 'Название товара' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1000, description: 'Цена товара' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 10, description: 'Количество на складе' })
  @IsNumber()
  stock: number;

  @ApiProperty({ example: 'Description', description: 'Описание товара' })
  @IsOptional()
  @IsString()
  description?: string;
}
