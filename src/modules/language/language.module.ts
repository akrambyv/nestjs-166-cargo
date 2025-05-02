import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { LanguageEntity } from '../../entities/Language.entity';
import { TranslationEntity } from '../../entities/Translation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LanguageEntity, TranslationEntity]),
  ],
  controllers: [LanguageController],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {} 