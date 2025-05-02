import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../entities/Order.entity';
import { TrackingEntity } from '../../entities/Tracking.entity';
import { OrderService } from '../order/order.service';
import { UpdateTrackingDto } from './dto/update-tracking.dto';
import { ShippingStatus } from './tracking.types';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>,
    @InjectRepository(TrackingEntity)
    private trackingRepo: Repository<TrackingEntity>,
    private orderService: OrderService,
  ) {}

  async getTrackingInfo(trackingNumber: string) {
    const order = await this.orderRepo.findOne({ 
      where: { trackingNumber },
      relations: ['trackingHistory']
    });
    
    if (!order) {
      throw new NotFoundException(`Order with tracking number ${trackingNumber} not found`);
    }
    
    const currentStatus = order.trackingHistory.find(track => track.isCurrentStatus) || 
                          order.trackingHistory[order.trackingHistory.length - 1];
    
    return {
      trackingNumber: order.trackingNumber,
      status: currentStatus?.status || ShippingStatus.PROCESSING,
      history: order.trackingHistory || [],
      estimatedDelivery: currentStatus?.estimatedDeliveryDate,
    };
  }

  async updateTracking(orderId: number, updateTrackingDto: UpdateTrackingDto) {
    const order = await this.orderService.findOne(orderId);
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    
    await this.trackingRepo.update(
      { orderId: order.id, isCurrentStatus: true },
      { isCurrentStatus: false }
    );
    
    const newTracking = this.trackingRepo.create({
      trackingNumber: order.trackingNumber,
      status: updateTrackingDto.status,
      location: updateTrackingDto.location,
      description: updateTrackingDto.description,
      orderId: order.id,
      order: order,
      isCurrentStatus: true,
      estimatedDeliveryDate: updateTrackingDto.estimatedDeliveryDate
    });
    
    return this.trackingRepo.save(newTracking);
  }
}