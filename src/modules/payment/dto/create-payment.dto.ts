import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsObject } from 'class-validator';
import { PaymentMethod } from '../payment.types';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Sifariş ID',
    example: 1
  })
  orderId: number;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @ApiProperty({
    description: 'Ödəniş metodu',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD
  })
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    description: 'Ödəniş detalları',
    example: {
      cardNumber: '4111111111111111',
      cardHolder: 'Akram Abiyev',
      expiryDate: '12/28',
      cvv: '123'
    },
    required: false
  })
  paymentDetails?: any;
} 