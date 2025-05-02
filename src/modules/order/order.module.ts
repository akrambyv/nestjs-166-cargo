import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderEntity } from '../../entities/Order.entity';
import { UserEntity } from '../../entities/User.entity';
import { TrackingEntity } from '../../entities/Tracking.entity';
import { TariffModule } from '../tariff/tariff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, UserEntity, TrackingEntity]),
    TariffModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule { }