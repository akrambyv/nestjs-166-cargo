import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { OrderEntity } from './Order.entity';
import { ShippingStatus } from 'src/modules/tracking/tracking.types';

@Entity('tracking')
export class TrackingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({
    type: 'enum',
    enum: ShippingStatus,
    default: ShippingStatus.PROCESSING
  })
  status: ShippingStatus;

  @Column()
  location: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  estimatedDeliveryDate: Date;

  @Column({ type: 'boolean', default: false })
  isCurrentStatus: boolean;

  @CreateDateColumn()
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => OrderEntity, order => order.trackingHistory)
  order: OrderEntity;

  @Column()
  orderId: number;
}