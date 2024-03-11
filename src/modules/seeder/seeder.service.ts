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
      password: '',
    };
    const user = await this.userService.findOneByEmail(userToCreate.email);

    if (!user) {
      await this.userService.create(userToCreate);
    }
  }
}
