import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TariffService } from './tariff.service';
import { TariffController } from './tariff.controller';
import { TariffEntity } from '../../entities/Tariff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TariffEntity])],
  controllers: [TariffController],
  providers: [TariffService],
  exports: [TariffService]
})
export class TariffModule {}