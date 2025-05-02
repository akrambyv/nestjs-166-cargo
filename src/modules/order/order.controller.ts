import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { UserRole } from '../user/user.types';
import { OrderStatus } from './order.types';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @ApiResponse({ status: 201, description: 'Sifariş uğurla yaradıldı' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(req.user, createOrderDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiResponse({ status: 200, description: 'Bütün sifarişlər qaytarılır' })
  findAll() {
    return this.orderService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('my-orders')
  @ApiResponse({ status: 200, description: 'Sifarişlər uğurla əldə edildi' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  findMyOrders(@Request() req) {
    return this.orderService.findByUser(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Sifariş məlumatları qaytarılır' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Bu sifarişi görüntüləmək üçün icazəniz yoxdur' })
  @ApiResponse({ status: 404, description: 'Sifariş tapılmadı' })
  async findOne(@Param('id') id: string, @Request() req) {
    const order = await this.orderService.findOne(+id);
    if (order.userId !== req.user.id && req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Bu sifarişi görüntüləmək üçün icazəniz yoxdur');
    }
    return order;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Sifariş uğurla yeniləndi' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Bu sifarişi yeniləmək üçün icazəniz yoxdur' })
  @ApiResponse({ status: 404, description: 'Sifariş tapılmadı' })
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Request() req) {
    const order = await this.orderService.findOne(+id);
    if (order.userId !== req.user.id && req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Bu sifarişi yeniləmək üçün icazəniz yoxdur');
    }
    return this.orderService.update(+id, updateOrderDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id/accept')
  acceptOrder(@Param('id') id: string) {
    return this.orderService.updateStatus(+id, OrderStatus.ACCEPTED);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id/reject')
  rejectOrder(@Param('id') id: string) {
    return this.orderService.updateStatus(+id, OrderStatus.REJECTED);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }

  @Get('track/:trackingNumber')
  @ApiResponse({ status: 200, description: 'Sifariş bilgiləri uğurla gətirildi' })
  @ApiResponse({ status: 404, description: 'Sifariş tapılmadı' })
  trackOrder(@Param('trackingNumber') trackingNumber: string) {
    return this.orderService.findByTrackingNumber(trackingNumber);
  }
}