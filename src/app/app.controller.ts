import { Controller, Get, HttpCode, Param, Render } from '@nestjs/common';
import { AdService } from 'src/ad/ad.service';

@Controller()
export class AppController {
  constructor(
    private readonly adServise: AdService
  ) {}

  @Render('index')
  @Get('/')
  async findAllUsers() {
     return {users: await this.adServise.findAllUsers()};
  }

  @Get(":user")
  async findOneUser (@Param('user') user: string) {
    return await this.adServise.findOneUser(user);
  }
}
