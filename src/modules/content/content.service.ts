import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentEntity } from '../../entities/Content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentEntity)
    private contentRepository: Repository<ContentEntity>,
  ) {
    this.initializeDefaultContents();
  }

  private async initializeDefaultContents(): Promise<void> {
    const defaultContents = [
      { 
        key: 'about-us', 
        title: 'Haqqımızda', 
        content: '166 Cargo, güvənilir kargo şirkəti!' 
      },
    ];

    for (const item of defaultContents) {
      const exists = await this.contentRepository.findOne({ where: { key: item.key } });
      if (!exists) {
        await this.contentRepository.save(item);
      }
    }
  }

  async findAll(): Promise<ContentEntity[]> {
    return this.contentRepository.find();
  }

  async findByKey(key: string): Promise<ContentEntity> {
    const content = await this.contentRepository.findOne({ where: { key } });
    if (!content) {
      throw new NotFoundException(`Content with key ${key} not found`);
    }
    return content;
  }

  async create(createContentDto: CreateContentDto): Promise<ContentEntity> {
    const exists = await this.contentRepository.findOne({ 
      where: { key: createContentDto.key } 
    });
    
    if (exists) {
      throw new Error(`Content with key ${createContentDto.key} already exists`);
    }
    
    const content = this.contentRepository.create(createContentDto);
    return this.contentRepository.save(content);
  }

  async update(key: string, updateContentDto: UpdateContentDto): Promise<ContentEntity> {
    const content = await this.findByKey(key);
    
    if (updateContentDto.title) content.title = updateContentDto.title;
    if (updateContentDto.content) content.content = updateContentDto.content;
    
    return this.contentRepository.save(content);
  }

  async remove(key: string): Promise<void> {
    const content = await this.findByKey(key);
    await this.contentRepository.remove(content);
  }
}