import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isEmpty } from 'lodash';
import { UserCreateDto } from './dto/user.create.dto';
import { User } from './entities/user.entity';
import { ResetPasswordRequest } from '../auth/entities/reset.password.request.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {

  }

  async create(createUserDto: UserCreateDto) {
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

  async update(address: string, updateUserDto: Partial<User>) {
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

  public async findOneByRefreshToken(refreshToken: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.token', 'token', 'token.refreshToken = :refreshToken', {
        refreshToken,
      })
      .getOne();
  }

  public async findOneByEmailJoinResetPasswordRequest(email: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .andWhere('email = :email', { email })
      .andWhere('removed_at IS NULL')
      .leftJoinAndSelect('user.resetPasswordRequest', 'resetPasswordRequest')
      .getOne();
  }

  public async requestResetPassword(user: User, passwordRequest: ResetPasswordRequest): Promise<void> {
    user.resetPasswordRequest = passwordRequest;
    await this.save(user);
    
    console.log('----- send email', {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token: passwordRequest.token,
    });
  }

  public async findOneByPasswordResetToken(token: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.resetPasswordRequest', 'resetPasswordRequest', 'resetPasswordRequest.token = :token', {
        token,
      })
      .leftJoinAndSelect('user.token', 'token')
      .getOne();
  }
}
