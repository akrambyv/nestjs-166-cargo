import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../../entities/Payment.entity';
import { OrderService } from '../order/order.service';
import { PaymentStatus} from './payment.types';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    private orderService: OrderService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    const order = await this.orderService.findOne(createPaymentDto.orderId);
    
    if (!order) {
      throw new NotFoundException('Sifariş tapılmadı');
    }

    const payment = this.paymentRepository.create({
      orderId: order.id,
      amount: order.price,
      currency: 'AZN',
      status: PaymentStatus.PENDING,
      paymentMethod: createPaymentDto.paymentMethod,
      paymentDetails: createPaymentDto.paymentDetails
    });

    return this.paymentRepository.save(payment);
  }

  async findAll(): Promise<PaymentEntity[]> {
    return this.paymentRepository.find({
      relations: ['order']
    });
  }

  async findOne(id: number): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order']
    });

    if (!payment) {
      throw new NotFoundException('Ödəniş tapılmadı');
    }

    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<PaymentEntity> {
    const payment = await this.findOne(id);

    if (updatePaymentDto.status) {
      payment.status = updatePaymentDto.status;
    }

    if (updatePaymentDto.transactionId) {
      payment.transactionId = updatePaymentDto.transactionId;
    }

    if (updatePaymentDto.paymentDetails) {
      payment.paymentDetails = updatePaymentDto.paymentDetails;
    }

    return this.paymentRepository.save(payment);
  }

  async processPayment(id: number): Promise<PaymentEntity> {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Ödəniş artıq emal edilib');
    }

    payment.status = PaymentStatus.COMPLETED;
    payment.transactionId = `TRX-${Date.now()}`;

    return this.paymentRepository.save(payment);
  }

  async refundPayment(id: number): Promise<PaymentEntity> {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Yalnız tamamlanmış ödənişlər geri qaytarıla bilər');
    }

    payment.status = PaymentStatus.REFUNDED;

    return this.paymentRepository.save(payment);
  }
} 