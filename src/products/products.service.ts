import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Op, Transaction } from 'sequelize';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product) private productModel: typeof Product) {}

  async create(dto: CreateProductDto): Promise<Product> {
    return this.productModel.create(dto);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const offset = (page - 1) * limit;
    const where = search ? { name: { [Op.iLike]: `%${search}%` } } : {};
    const { rows, count } = await this.productModel.findAndCountAll({
      where,
      offset,
      limit,
    });
    return { data: rows, total: count, page, limit };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productModel.findByPk(id);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    await product.update(dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await product.destroy();
  }

  async decreaseStock(id: number, quantity: number, transaction?: Transaction) {
    const product = await this.findOne(id);
    if (product.stock < quantity)
      throw new Error(`Insufficient stock for ${product.name}`);
    product.stock -= quantity;
    await product.save({ transaction });
  }
}
