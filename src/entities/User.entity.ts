import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity } from 'typeorm';
import { UserRole, Gender } from '../modules/user/user.types';
import { OrderEntity } from './Order.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({
        type: 'enum',
        enum: Gender,
        nullable: true
    })
    gender: Gender;

    @Column({ type: 'date', nullable: true })
    birthDate: Date;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    profileImage: string;

    @Column({ type: 'text', nullable: true })
    about: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @Column({ nullable: true })
    resetPasswordToken: string;

    @Column({ nullable: true })
    resetPasswordExpires: Date;

    @OneToMany(() => OrderEntity, order => order.user)
    orders: OrderEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
