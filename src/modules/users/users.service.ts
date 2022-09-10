import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isEmpty } from 'lodash';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {

  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(this.userRepository.create(createUserDto));
  }

  public async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOneById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(address: string, updateUserDto: UpdateUserDto) {
    const user = await this.checkIfUserExists(address);

    const updatedUser = {
      ...user,
      ...updateUserDto,
    } as User;
    return await this.userRepository.save(updatedUser);
  }

  async remove(email: string) {
    await this.checkIfUserExists(email);
    return await this.userRepository.delete({ email });
  }

  public async nullifyToken(email: string): Promise<string> {
    const user = await this.findOneByEmail(email);
    if (!isEmpty(user)) {
      const tokenId = user.token.id;
      user.token = null;
      await this.save(user);
      return tokenId;
    }
  }

  async checkIfUserExists(email: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new Error('User not exists');
    }

    return user;
  }
}
