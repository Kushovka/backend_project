import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.model';
import { Product } from './products/product.model';
import { Order } from './orders/order.model';
import { OrderItem } from './orders/order-item.model';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User, Product, Order, OrderItem],
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
