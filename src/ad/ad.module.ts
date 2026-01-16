import { Module } from '@nestjs/common';
import { AdService } from './ad.service';

@Module({
    imports: [],
    controllers: [],
    providers: [AdService],
    exports: [AdService],
})
export class AdModule {}
