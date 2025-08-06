import { Controller, Get } from '@nestjs/common';
import { UserService } from './users.service';

@Controller()
export class Userontroller {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello(); 
  }
}
