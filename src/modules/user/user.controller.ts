import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Request, Post, ForbiddenException, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from './user.types';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger'; 
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiResponse({ status: 200, description: 'Bütün istifadəçilər qaytarılır' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.userService.findAll(page, limit);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  @ApiResponse({ 
    status: 200, 
    description: 'İstifadəçi profili və rol məlumatları qaytarılır',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        gender: 'male',
        createdAt: '2024-03-20T10:00:00Z',
        updatedAt: '2024-03-20T10:00:00Z'
      }
    }
  })
  getProfile(@Request() req) {
    const { password, ...user } = req.user;
    return {
      ...user,
      role: user.role,
      roleDescription: user.role === UserRole.SUPER_ADMIN 
        ? 'Super Admin - Bütün istifadəçiləri və adminləri idarə edə bilər'
        : user.role === UserRole.ADMIN 
          ? 'Admin - Adi istifadəçiləri idarə edə bilər'
          : 'Adi İstifadəçi'
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'İstifadəçi profili qaytarılır' })
  @ApiResponse({ status: 403, description: 'Yalnız öz profilinizi görüntüləyə bilərsiniz' })
  async findOne(@Param('id') id: number, @Request() req) {
    if (req.user.id !== id && req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Yalnız öz profilinizi görüntüləyə bilərsiniz');
    }
    return this.userService.findById(id);
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  // @Patch('me')
  // @ApiResponse({ status: 200, description: 'Profil uğurla yeniləndi' })
  // updateMe(@Request() req, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(req.user.id, updateUserDto);
  // }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  // @Patch(':id')
  // @ApiResponse({ status: 200, description: 'Profil uğurla yeniləndi' })
  // update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'İstifadəçi uğurla silindi' })
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post(':id/set-admin')
  @ApiResponse({ status: 200, description: 'İstifadəçi rolu admin olaraq yeniləndi' })
  @ApiResponse({ status: 403, description: 'Yalnız super admin admin rollarını dəyişdirə bilər' })
  async setAdmin(@Param('id') id: number, @Request() req) {
    const targetUser = await this.userService.findById(+id);
    const currentUser = req.user;

    if (targetUser.role === UserRole.ADMIN && currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Yalnız super admin admin rollarını dəyişdirə bilər');
    }

    return this.userService.setRole(+id, UserRole.ADMIN, req.user);
  }

  @ApiBearerAuth() 
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post(':id/set-user')
  @ApiResponse({ status: 200, description: 'İstifadəçi rolu adi istifadəçi olaraq yeniləndi' })
  @ApiResponse({ status: 403, description: 'Yalnız super admin admin rollarını dəyişdirə bilər' })
  async setUser(@Param('id') id: number, @Request() req) {
    return this.userService.setRole(+id, UserRole.USER, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('change-password')
  @ApiResponse({ status: 200, description: 'Şifrə uğurla dəyişdirildi' })
  @ApiResponse({ status: 400, description: 'Yanlış şifrə formatı' })
  @ApiResponse({ status: 401, description: 'Mövcud şifrə yanlışdır' })
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.id, changePasswordDto);
  }

  @Post('forgot-password')
  @ApiResponse({ status: 200, description: 'Şifrə sıfırlama linki göndərildi' })
  @ApiResponse({ status: 404, description: 'İstifadəçi tapılmadı' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiResponse({ status: 200, description: 'Şifrə uğurla sıfırlandı' })
  @ApiResponse({ status: 400, description: 'Keçərsiz və ya vaxtı dolmuş token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }
}