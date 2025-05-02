import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/user.types';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @ApiResponse({ status: 201, description: 'Ödəniş uğurla yaradıldı' })
  @ApiResponse({ status: 400, description: 'Yanlış məlumat' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 404, description: 'Sifariş tapılmadı' })
  create(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  @ApiResponse({ status: 200, description: 'Bütün ödənişlər qaytarılır' })
  findAll() {
    return this.paymentService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Ödəniş məlumatları qaytarılır' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 404, description: 'Ödəniş tapılmadı' })
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Ödəniş uğurla yeniləndi' })
  @ApiResponse({ status: 400, description: 'Yanlış məlumat' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  @ApiResponse({ status: 404, description: 'Ödəniş tapılmadı' })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post(':id/process')
  @ApiResponse({ status: 200, description: 'Ödəniş uğurla emal edildi' })
  @ApiResponse({ status: 400, description: 'Ödəniş artıq emal edilib' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  @ApiResponse({ status: 404, description: 'Ödəniş tapılmadı' })
  processPayment(@Param('id') id: string) {
    return this.paymentService.processPayment(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post(':id/refund')
  @ApiResponse({ status: 200, description: 'Ödəniş uğurla geri qaytarıldı' })
  @ApiResponse({ status: 400, description: 'Yalnız tamamlanmış ödənişlər geri qaytarıla bilər' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  @ApiResponse({ status: 404, description: 'Ödəniş tapılmadı' })
  refundPayment(@Param('id') id: string) {
    return this.paymentService.refundPayment(+id);
  }
} 