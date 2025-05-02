import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingEntity } from '../../entities/Setting.entity';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingEntity)
    private settingsRepository: Repository<SettingEntity>,
  ) {
    this.initializeDefaultSettings();
  }

  private async initializeDefaultSettings(): Promise<void> {
    const defaultSettings = [
      { key: 'siteName', value: '166 Cargo' },
      { key: 'logo', value: '/logo.png' },
      { key: 'contactEmail', value: 'info@166cargo.com' },
      { key: 'contactPhone', value: '+994 12 345 67 89' },
      { key: 'contactAddress', value: 'Bakı, Azerbaycan' },
      { key: 'workingHours', value: '09:00 - 18:00' },
      { key: 'whatsappNumber', value: '+994 12 345 67 89' },
      { key: 'mapCoordinates', value: '40.4093, 49.8671' },
      { key: 'paymentMethods', value: 'Kredit kartı, Nağd ödəniş' },
      { key: 'trackingPageTitle', value: 'Kargo Takip' },
      { key: 'trackingPageDescription', value: 'Kargo takip səhifəsinə xoş gəldiniz. Kargo nömrənizi girərək kargonuzun durumunu görə biləcəksiniz.' }
    ];
    
    for (const setting of defaultSettings) {
      const exists = await this.settingsRepository.findOne({ where: { key: setting.key } });
      if (!exists) {
        await this.settingsRepository.save(setting);
      }
    }
  }

  async findAll(): Promise<SettingEntity[]> {
    return this.settingsRepository.find();
  }

  async findByKey(key: string): Promise<SettingEntity> {
    const setting = await this.settingsRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }
    return setting;
  }

  async update(key: string, updateSettingDto: UpdateSettingDto): Promise<SettingEntity> {
    const setting = await this.findByKey(key);
    setting.value = updateSettingDto.value;
    return this.settingsRepository.save(setting);
  }

  async getAllSettings(): Promise<Record<string, string>> {
    const settings = await this.findAll();
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }
}