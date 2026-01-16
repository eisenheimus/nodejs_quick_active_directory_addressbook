import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdModule } from 'src/ad/ad.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AdModule, 
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    })],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
