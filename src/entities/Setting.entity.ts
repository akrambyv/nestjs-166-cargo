import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('settings')
export class SettingEntity extends BaseEntity {
  @ApiProperty({ example: 1, description: 'Ayarın benzersiz ID\'si' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'siteName', description: 'Ayar anahtarı' })
  @Column({ unique: true })
  key: string;

  @ApiProperty({ example: '166 Cargo', description: 'Ayar değeri' })
  @Column('text')
  value: string;

  @ApiProperty({ description: 'Oluşturulma tarihi' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Güncellenme tarihi' })
  @UpdateDateColumn()
  updatedAt: Date;
}