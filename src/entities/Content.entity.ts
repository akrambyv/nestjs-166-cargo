import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('contents')
export class ContentEntity extends BaseEntity {
  @ApiProperty({ example: 1, description: 'Məzmunun unikal ID-si' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'about-us', description: 'Məzmun açarı' })
  @Column({ unique: true })
  key: string;

  @ApiProperty({ example: 'Şirkətimiz haqqında...', description: 'Məzmun başlığı' })
  @Column()
  title: string;

  @ApiProperty({ example: '<p>166 Cargo, güvənilir kargo şirkəti!</p>', description: 'HTML və ya düz mətn məzmun' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: 'Yaradılma tarixi' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Yenilənmə tarixi' })
  @UpdateDateColumn()
  updatedAt: Date;
}