import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../entities/Order.entity';
import { OrderModule } from '../order/order.module';
import { TrackingEntity } from '../../entities/Tracking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, TrackingEntity]),
    OrderModule,
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}