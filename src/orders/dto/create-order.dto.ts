import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: 1 }) @IsNumber() productId: number;
  @ApiProperty({ example: 2 }) @IsNumber() quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 'Some Address', required: false })
  @IsOptional()
  @IsString()
  shippingAddress?: string;
}
