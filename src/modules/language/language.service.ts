import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanguageEntity } from '../../entities/Language.entity';
import { TranslationEntity } from '../../entities/Translation.entity';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>,
    @InjectRepository(TranslationEntity)
    private translationRepository: Repository<TranslationEntity>,
  ) {}

  async create(createLanguageDto: CreateLanguageDto): Promise<LanguageEntity> {
    const language = this.languageRepository.create(createLanguageDto);
    return this.languageRepository.save(language);
  }

  async findAll(): Promise<LanguageEntity[]> {
    return this.languageRepository.find();
  }

  async findActive(): Promise<LanguageEntity[]> {
    return this.languageRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<LanguageEntity> {
    const language = await this.languageRepository.findOne({ where: { id } });
    if (!language) {
      throw new NotFoundException('Dil tapılmadı');
    }
    return language;
  }

  async findByCode(code: string): Promise<LanguageEntity> {
    const language = await this.languageRepository.findOne({ where: { code } });
    if (!language) {
      throw new NotFoundException('Dil tapılmadı');
    }
    return language;
  }

  async update(id: number, updateLanguageDto: UpdateLanguageDto): Promise<LanguageEntity> {
    const language = await this.findOne(id);
    Object.assign(language, updateLanguageDto);
    return this.languageRepository.save(language);
  }

  async remove(id: number): Promise<void> {
    const language = await this.findOne(id);
    await this.languageRepository.remove(language);
  }

  async createTranslation(createTranslationDto: CreateTranslationDto): Promise<TranslationEntity> {
    const translation = this.translationRepository.create(createTranslationDto);
    return this.translationRepository.save(translation);
  }

  async findAllTranslations(languageId: number): Promise<TranslationEntity[]> {
    return this.translationRepository.find({
      where: { languageId },
      relations: ['language']
    });
  }

  async findTranslationByKey(languageId: number, key: string): Promise<TranslationEntity> {
    const translation = await this.translationRepository.findOne({
      where: { languageId, key },
      relations: ['language']
    });
    if (!translation) {
      throw new NotFoundException('Tərcümə tapılmadı');
    }
    return translation;
  }

  async updateTranslation(id: number, updateTranslationDto: UpdateTranslationDto): Promise<TranslationEntity> {
    const translation = await this.translationRepository.findOne({ where: { id } });
    if (!translation) {
      throw new NotFoundException('Tərcümə tapılmadı');
    }
    Object.assign(translation, updateTranslationDto);
    return this.translationRepository.save(translation);
  }

  async removeTranslation(id: number): Promise<void> {
    const translation = await this.translationRepository.findOne({ where: { id } });
    if (!translation) {
      throw new NotFoundException('Tərcümə tapılmadı');
    }
    await this.translationRepository.remove(translation);
  }

  async getTranslationsByGroup(languageId: number): Promise<TranslationEntity[]> {
    return this.translationRepository.find({
      where: { languageId },
      relations: ['language']
    });
  }

  async getDefaultLanguage(): Promise<LanguageEntity> {
    const language = await this.languageRepository.findOne({ where: { isDefault: true } });
    if (!language) {
      throw new NotFoundException('Varsayılan dil tapılmadı');
    }
    return language;
  }
} 