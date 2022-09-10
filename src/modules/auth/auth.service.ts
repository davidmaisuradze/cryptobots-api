import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthTokenDto, LoginDto, RegisterDto } from './dto';
import { AuthTokenUpdateDto } from './dto/auth.token.update.dto';
import { AuthToken } from './entities/auth.token.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
  ) { }

  async register(userDto: RegisterDto) {
    const { firstName, lastName, email, password } = userDto;

    const user = await this.usersService.findOneByEmail(email);
    if(user) {
      throw new Error('User already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await this.usersService.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    delete user.password;

    return newUser;
  }

  async login(loginDto: LoginDto) {
    const { email: loginEmail, password } = loginDto;

    const user = await this.usersService.checkIfUserExists(loginEmail);

    if (!await bcrypt.compare(password, user.password)) {
      throw new BadRequestException('invalid credentials');
    }

    const authToken = await this.createTokensPair({
      email: loginEmail,
    });

    const { accessToken, refreshToken } = authToken;
    const token = this.createAuthToken(accessToken, refreshToken);
    const { email, firstName, lastName } = await this.usersService.update(user.email, {
      token,
    });

    return {
      email,
      firstName,
      lastName,
    };
  } 

  public async createTokensPair(jwtPayload: JwtPayload): Promise<AuthTokenDto> {
    const accessToken = await this.jwtService.signAsync(jwtPayload);
    return {
      accessToken,
      refreshToken: await uuidv4(256),
    };
  }

  public createAuthToken(accessToken: string, refreshToken: string): AuthToken {
    return this.authTokenRepository.create({
      accessToken,
      refreshToken,
    });
  }

  public async validateUser(payload: JwtPayload): Promise<User> {
    return await this.usersService.findOneByEmail(payload.email);
  }

  public async logout(email: string): Promise<DeleteResult> {
    const tokenId = await this.usersService.nullifyToken(email);
    return this.authTokenRepository.delete(tokenId);
  }

  public async updateToken(id: string, updateDto: AuthTokenUpdateDto): Promise<UpdateResult> {
    return this.authTokenRepository.update(id, updateDto);
  }
}
