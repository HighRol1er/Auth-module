import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<any> {
    const users = await this.userService.getUsers();
    if (users.length === 0) {
      return {
        message: 'No users found',
        status: 404,
      };
    }
    return {
      message: 'Users found',
      data: users,
    };
  }

  @Post()
  async insertUser(): Promise<any> {
    await this.userService.insertUser();
    return {
      message: 'User inserted',
    };
  }
}
