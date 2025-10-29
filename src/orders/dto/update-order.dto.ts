import { IsOptional, IsEnum, IsString } from 'class-validator';
import { OrderStatus } from '../models/order.model';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  shippingAddress?: string;
}

