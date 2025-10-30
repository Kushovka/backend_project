import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../order.model';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiPropertyOptional({ enum: OrderStatus, description: 'Статус заказа' })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
