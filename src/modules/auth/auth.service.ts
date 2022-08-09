import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthTokenDto } from './dto';
import { AuthTokenUpdateDto } from './dto/auth.token.update.dto';
import { AuthToken } from './entities/auth.token.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
  ) {

  }

  async getNonce(address: string) {
    let user = await this.usersService.findOneByAddress(address);
    if (!user) {
      user = await this.usersService.create({
        address,
        signNonce: Math.floor(Math.random() * 1000000),
      });
    }

    if(user && !user.signNonce) {
      user = await this.usersService.update(address, {
        signNonce: Math.floor(Math.random() * 1000000),
      });
    }

    return user.signNonce;
  }

  async verifySignedLoginTransaction(address: string, signature: any) {
    const user = await this.usersService.checkIfUserExists(address);

    const message = `Sign this transaction to verify your identity: ${user.signNonce}`;
    const signerAddress = ethers.utils.verifyMessage(message, signature);

    if (signerAddress === address) {
      const authToken = await this.createTokensPair({
        address,
      });

      const { accessToken, refreshToken } = authToken;
      const token = this.createAuthToken(accessToken, refreshToken);
      const { email, firstName, lastName } = await this.usersService.update(user.address, {
        signNonce: Math.floor(Math.random() * 1000000),
        token,
      });

      return {
        token,
        email,
        firstName,
        lastName,
      };
    } else {
      throw new UnauthorizedException();
    }
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
    return await this.usersService.findOneByAddress(payload.address);
  }

  public async logout(payload: JwtPayload): Promise<DeleteResult> {
    const tokenId = await this.usersService.nullifyToken(payload.address);
    return this.authTokenRepository.delete(tokenId);
  }

  public async updateToken(id: string, updateDto: AuthTokenUpdateDto): Promise<UpdateResult> {
    return this.authTokenRepository.update(id, updateDto);
  }
}
