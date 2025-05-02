import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsObject } from 'class-validator';
import { PaymentStatus } from '../payment.types';

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  @ApiProperty({
    description: 'Ödəniş statusu',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
    required: false
  })
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Tranzaksiya ID',
    example: 'TRX-123456789',
    required: false
  })
  transactionId?: string;

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