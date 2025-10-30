import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async create(dto: CreateUserDto): Promise<User> {
    if (dto.password) {
      const salt = await bcrypt.genSalt();
      dto.password = await bcrypt.hash(dto.password, salt);
    }
    return this.userModel.create(dto);
  }

  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { rows, count } = await this.userModel.findAndCountAll({
      attributes: { exclude: ['password'] },
      offset,
      limit,
    });
    return { data: rows, total: count, page, limit };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    if (dto.password) {
      const salt = await bcrypt.genSalt();
      dto.password = await bcrypt.hash(dto.password, salt);
    }
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    await user.update(dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    await user.destroy();
  }
}
