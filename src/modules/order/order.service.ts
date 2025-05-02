import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../../entities/Order.entity';
import { TrackingEntity } from '../../entities/Tracking.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from '../../entities/User.entity';
import { OrderStatus } from './order.types';
import { v4 as uuidv4 } from 'uuid';
import { ShippingStatus } from '../tracking/tracking.types';
import { TariffService } from '../tariff/tariff.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(TrackingEntity)
    private trackingRepository: Repository<TrackingEntity>,
    private tariffService: TariffService,
  ) {}

  async createOrder(user: UserEntity, createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const order = new OrderEntity();
    order.description = createOrderDto.description;
    order.weight = createOrderDto.weight;
    
    if (createOrderDto.price) {
      order.price = createOrderDto.price;
    } else {
      const calculatedPrice = await this.tariffService.calculatePrice({
        weight: createOrderDto.weight,
        tariffId: createOrderDto.tariffId
      });
      order.price = calculatedPrice.price;
    }
    
    order.user = user;
    order.userId = user.id;
    order.trackingNumber = this.generateTrackingNumber();

    const savedOrder = await this.orderRepository.save(order);
    
    const initialTracking = new TrackingEntity();
    initialTracking.trackingNumber = savedOrder.trackingNumber;
    initialTracking.status = ShippingStatus.PROCESSING;
    initialTracking.location = 'Başlanğıç İşləmi';
    initialTracking.description = 'Sifarişiniz işləmə alındı.';
    initialTracking.estimatedDeliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    initialTracking.isCurrentStatus = true;
    initialTracking.order = savedOrder;
    initialTracking.orderId = savedOrder.id;
    
    await this.trackingRepository.save(initialTracking);
    
    return this.findOne(savedOrder.id);
  }

  async findByTrackingNumber(trackingNumber: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ 
      where: { trackingNumber },
      relations: ['user'] 
    });
    
    if (!order) {
      throw new NotFoundException(`Order with tracking number ${trackingNumber} not found`);
    }
    if (order.user) {
      const { password, ...userWithoutPassword } = order.user;
      order.user = userWithoutPassword as UserEntity;
    }
    return order;
  }

  private generateTrackingNumber(): string {
    return `166C-${uuidv4().substring(0, 8).toUpperCase()}`;
  }

  async findAll(): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      relations: ['user'],
    });
    return orders.map(order => {
      if (order.user) {
        const { password, ...userWithoutPassword } = order.user;
        order.user = userWithoutPassword as UserEntity;
      }
      return order;
    });
  }

  async findByUser(userId: number): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    return orders.map(order => {
      if (order.user) {
        const { password, ...userWithoutPassword } = order.user;
        order.user = userWithoutPassword as UserEntity;
      }
      return order;
    });
  }

  async findOne(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    if (order.user) {
      const { password, ...userWithoutPassword } = order.user;
      order.user = userWithoutPassword as UserEntity;
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    const order = await this.findOne(id);
    
    if (updateOrderDto.description) {
      order.description = updateOrderDto.description;
    }
    
    if (updateOrderDto.weight) {
      order.weight = updateOrderDto.weight;
    }
    
    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }
    
    return this.orderRepository.save(order);
  }

  async updateStatus(id: number, status: OrderStatus): Promise<OrderEntity> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}