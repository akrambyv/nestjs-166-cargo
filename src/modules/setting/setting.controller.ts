import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './setting.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { UserRole } from '../user/user.types';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettingEntity } from 'src/entities/Setting.entity';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @ApiResponse({
    status: 200,
    description: 'Bütün ayarlar key-value formatında',
    schema: {
      example: {
        siteName: '166 Cargo',
        logo: '/166cargo.png',
        contactEmail: 'info@166cargo.com',
        contactPhone: '+994 12 345 67 89',
        contactAddress: 'Baku, Azerbaycan',
        workingHours: '09:00 - 18:00',
        whatsappNumber: '+994 12 345 67 89',
        mapCoordinates: '40.4093, 49.8671',
        paymentMethods: 'Kredit kartı, Nağd ödəniş',
        trackingPageTitle: 'Kargo Takip',
        trackingPageDescription: 'Kargo takip səhifəsinə xoş gəldiniz. Kargo nömrənizi girərək kargonuzun durumunu görə biləcəksiniz.'
      }
    }
  })
  @Get()
  findAll() {
    return this.settingsService.getAllSettings();
  }

  @ApiResponse({ status: 200, description: 'Bulunan ayar', type: SettingEntity })
  @ApiResponse({ status: 404, description: 'Ayar bulunamadı' })
  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiResponse({ status: 200, description: 'Ayar güncellendi', type: SettingEntity })
  @ApiResponse({ status: 404, description: 'Ayar bulunamadı' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only admin and super admin can update settings' })
  @Patch(':key')
  update(@Param('key') key: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(key, updateSettingDto);
  }
}