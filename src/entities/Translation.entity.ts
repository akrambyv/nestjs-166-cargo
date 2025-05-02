import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { LanguageEntity } from './Language.entity';

@Entity('translations')
export class TranslationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column('text')
  value: string;

  // @Column({ nullable: true })
  // group: string;

  @ManyToOne(() => LanguageEntity, language => language.translations)
  language: LanguageEntity;

  @Column()
  languageId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 