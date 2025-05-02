import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from 'typeorm';
import { UserEntity } from './User.entity';
import { OrderStatus } from '../modules/order/order.types';
import { TrackingEntity } from './Tracking.entity';

@Entity('orders')
export class OrderEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    trackingNumber: string;
    
    @Column({ nullable: true })
    description: string;
    
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    weight: number;
    
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;
    
    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status: OrderStatus;
    
    @ManyToOne(() => UserEntity, user => user.orders, { onDelete: 'CASCADE' })
    user: UserEntity;
    
    @OneToMany(() => TrackingEntity, tracking => tracking.order)
    trackingHistory: TrackingEntity[];
    
    @Column()
    userId: number;
    
    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;
}