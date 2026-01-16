import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { AdService } from 'src/ad/ad.service';

@Controller()
export class AppController {
  constructor(
    private readonly adServise: AdService
  ) {}

  @Get('/')
  async findAllUsers() {
    return await this.adServise.findAllUsers();
  }

  @Get(":user")
  async findOneUser (@Param('user') user: string) {
    return await this.adServise.findOneUser(user);
  }
}
