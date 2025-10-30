import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, OrderStatus } from './order.model';
import { OrderItem } from './order-item.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderItem)
    private orderItemModel: typeof OrderItem,
    private productsService: ProductsService,
  ) {}

  // Создание заказа
  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    const transaction = await this.orderModel.sequelize.transaction();

    try {
      let total = 0;

      const order = await this.orderModel.create(
        {
          userId,
          shippingAddress: createOrderDto.shippingAddress || '',
          status: OrderStatus.PENDING,
        },
        { transaction },
      );

      for (const item of createOrderDto.items) {
        const product = await this.productsService.findOne(item.productId);

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}`,
          );
        }

        total += Number(product.price) * item.quantity;

        await this.orderItemModel.create(
          {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: Number(product.price),
          },
          { transaction },
        );

        await this.productsService.decreaseStock(item.productId, item.quantity, transaction);
      }

      await order.update({ total }, { transaction });

      await transaction.commit();

      return this.findOne(order.id);
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw error;
    }
  }

  // Получить все заказы
  async findAll(): Promise<Order[]> {
    return this.orderModel.findAll({
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'items' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  // Получить один заказ
  async findOne(id: number): Promise<Order> {
    const order = await this.orderModel.findByPk(id, {
      include: [
        { association: 'user', attributes: { exclude: ['password'] } },
        { association: 'items' },
      ],
    });

    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    return order;
  }

  // Обновление заказа
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    const { items, status, shippingAddress } = updateOrderDto;

    // Обновляем только поля заказа
    const fieldsToUpdate: Partial<Order> = {};
    if (status) fieldsToUpdate.status = status;
    if (shippingAddress) fieldsToUpdate.shippingAddress = shippingAddress;

    if (Object.keys(fieldsToUpdate).length) {
      await order.update(fieldsToUpdate);
    }

    // Обновляем позиции через транзакцию
    if (items && items.length) {
      await this.orderModel.sequelize.transaction(async (transaction) => {
        await this.orderItemModel.destroy({ where: { orderId: id }, transaction });

        for (const item of items) {
          const product = await this.productsService.findOne(item.productId);

          if (product.stock < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for product ${product.name}`,
            );
          }

          await this.orderItemModel.create(
            {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: Number(product.price),
            },
            { transaction },
          );

          await this.productsService.decreaseStock(item.productId, item.quantity, transaction);
        }
      });
    }

    return this.findOne(id);
  }

  // Удаление заказа
  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await order.destroy();
  }

  // Отмена заказа
  async cancelOrder(id: number): Promise<Order> {
    const order = await this.findOne(id);

    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel delivered order');
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    return this.findOne(id);
  }
}
