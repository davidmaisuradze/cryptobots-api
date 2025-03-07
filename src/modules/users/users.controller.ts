import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('user')
  async user(@CurrentUser() currentUser: User) {
    try {
      const { password, token, ...result } = await this.usersService.findOneByEmail(currentUser.email);

      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
  
  @Post()
  create(@Body() createUserDto: UserCreateDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':address')
  findOneById(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(':address')
  update(@Param('address') id: string, @Body() updateUserDto: UserUpdateDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':address')
  remove(@Param('address') id: string) {
    return this.usersService.remove(id);
  }
}
