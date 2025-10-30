import { ApiProperty } from '@nestjs/swagger';
import { OrderItemDto } from './order-item.dto';

export class OrderDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  total: number;

  @ApiProperty({ nullable: true })
  shippingAddress?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];
}
