import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class SeederService {
  constructor(private userService: UsersService) {}

  public async seedDatabase() {
    const userToCreate = {
      firstName: 'David',
      lastName: 'Maisuradze',
      email: 'datomaisuradze95@gmail.com',
      address: '0x0Db7C90c4d31626a8B62A403D6B28340D0e1191C',
    };
    const user = await this.userService.findOneByEmail(userToCreate.email);

    if (!user) {
      await this.userService.create(userToCreate);
    }
  }
}
