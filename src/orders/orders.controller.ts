import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderDto } from './dto/order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({ status: 201, description: 'Order created', type: OrderDto })
  create(@Body() dto: CreateOrderDto) {
    const userId = 3; // пока захардкожено
    return this.ordersService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'List of orders', type: [OrderDto] })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order', type: OrderDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order' })
  @ApiResponse({ status: 200, description: 'Order updated', type: OrderDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({ status: 200, description: 'Order deleted', type: OrderDto })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  @ApiResponse({ status: 200, description: 'Order cancelled', type: OrderDto })
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.cancelOrder(id);
  }
}
