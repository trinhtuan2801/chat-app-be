import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repos/user.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../utils/helpers';
import { IUser } from './interfaces/user.interface';
import { Connection } from 'typeorm';

@Injectable()
export class UserService {
  private userRepository: UserRepository
  constructor(
    private readonly connection: Connection
  ) {
    this.userRepository = this.connection.getCustomRepository(UserRepository)
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async create(data: IUser): Promise<User> {
    const user = new User();
    user.name = data.name;
    user.email = data.email;
    user.password = await hashPassword(data.password);
    user.phone = data.phone;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return await this.userRepository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ id });
  }

  async findByUsername(name: string): Promise<User | null> {
    return await this.userRepository.findOne({ name });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ email });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await this.userRepository.findOne({ phone });
  }

  async update(user: User, data: IUser) {
    data.updatedAt = new Date();
    return await this.userRepository.update(user, data);
  }

  async deleteById(id: number): Promise<void> {
    await this.userRepository.delete({ id });
  }

}
