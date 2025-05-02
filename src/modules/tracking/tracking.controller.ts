import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/user.types';
import { UpdateTrackingDto } from './dto/update-tracking.dto';

@ApiTags('tracking')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get(':trackingNumber')
  @ApiResponse({ status: 200, description: 'Kargo izləmə məlumatları qaytarılır' })
  @ApiResponse({ status: 404, description: 'Kargo tapılmadı' })
  getTrackingInfo(@Param('trackingNumber') trackingNumber: string) {
    return this.trackingService.getTrackingInfo(trackingNumber);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post(':orderId')
  @ApiResponse({ status: 200, description: 'Kargo izləmə məlumatları uğurla yeniləndi' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  @ApiResponse({ status: 404, description: 'Kargo tapılmadı' })
  updateTracking(
    @Param('orderId') orderId: string,
    @Body() updateTrackingDto: UpdateTrackingDto,
  ) {
    return this.trackingService.updateTracking(+orderId, updateTrackingDto);
  }
}