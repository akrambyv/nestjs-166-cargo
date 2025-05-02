import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TariffService } from './tariff.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { UserRole } from '../user/user.types';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TariffEntity } from 'src/entities/Tariff.entity';
import { CalculatePriceDto } from './dto/calculate-tariff.dto';

@ApiTags('tariffs')
@Controller('tariffs')
export class TariffController {
  constructor(private readonly tariffService: TariffService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  @ApiResponse({ status: 201, description: 'Tarifə uğurla əlavə edildi', type: TariffEntity })
  @ApiResponse({ status: 400, description: 'Yanlış məlumat' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  create(@Body() createTariffDto: CreateTariffDto) {
    return this.tariffService.create(createTariffDto);
  }

  @Post('calculate')
  @ApiResponse({
    status: 200, description: 'Hesablanmış qiymət',
    schema: {
      properties: {
        price: { type: 'number', example: 55.00 },
        currency: { type: 'string', example: 'AZN' },
        breakdown: {
          type: 'object',
          properties: {
            basePrice: { type: 'number', example: 25.00 },
            weightPrice: { type: 'number', example: 30.00 }
          }
        }
      }
    }
  })
  calculatePrice(@Body() calculatePriceDto: CalculatePriceDto) {
    return this.tariffService.calculatePrice(calculatePriceDto);
  }
  

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiResponse({ status: 200, description: 'Bütün tarifələr qaytarılır' })
  findAll() {
    return this.tariffService.findAll();
  }

  @Get('active')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiResponse({ status: 200, description: 'Aktiv tarifələr qaytarılır' })
  findActive() {
    return this.tariffService.findActive();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Tarifə məlumatları qaytarılır' })
  @ApiResponse({ status: 404, description: 'Tarifə tapılmadı' })
  findOne(@Param('id') id: string) {
    return this.tariffService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Tarifə uğurla yeniləndi' })
  @ApiResponse({ status: 400, description: 'Yanlış məlumat' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  @ApiResponse({ status: 404, description: 'Tarifə tapılmadı' })
  update(@Param('id') id: string, @Body() updateTariffDto: UpdateTariffDto) {
    return this.tariffService.update(+id, updateTariffDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Tarifə uğurla silindi' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  @ApiResponse({ status: 404, description: 'Tarifə tapılmadı' })
  remove(@Param('id') id: string) {
    return this.tariffService.remove(+id);
  }
}