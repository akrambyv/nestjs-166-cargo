import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/user.types';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('languages')
@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  @ApiResponse({ status: 201, description: 'Dil uğurla əlavə edildi' })
  @ApiResponse({ status: 400, description: 'Yanlış məlumat' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languageService.create(createLanguageDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Bütün dillər qaytarılır' })
  findAll() {
    return this.languageService.findAll();
  }

  @Get('active')
  @ApiResponse({ status: 200, description: 'Aktiv dillər qaytarılır' })
  findActive() {
    return this.languageService.findActive();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Dil məlumatları qaytarılır' })
  @ApiResponse({ status: 404, description: 'Dil tapılmadı' })
  findOne(@Param('id') id: string) {
    return this.languageService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Dil uğurla yeniləndi' })
  @ApiResponse({ status: 400, description: 'Yanlış məlumat' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  @ApiResponse({ status: 404, description: 'Dil tapılmadı' })
  update(@Param('id') id: string, @Body() updateLanguageDto: UpdateLanguageDto) {
    return this.languageService.update(+id, updateLanguageDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Dil uğurla silindi' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  @ApiResponse({ status: 404, description: 'Dil tapılmadı' })
  remove(@Param('id') id: string) {
    return this.languageService.remove(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post(':id/translations')
  @ApiResponse({ status: 201, description: 'Tərcümə uğurla əlavə edildi' })
  @ApiResponse({ status: 400, description: 'Yanlış məlumat' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  @ApiResponse({ status: 404, description: 'Dil tapılmadı' })
  createTranslation(
    @Param('id') id: string,
    @Body() createTranslationDto: CreateTranslationDto
  ) {
    return this.languageService.createTranslation({
      ...createTranslationDto,
      languageId: +id
    });
  }

  @Get(':id/translations')
  @ApiResponse({ status: 200, description: 'Bütün tərcümələr qaytarılır' })
  @ApiResponse({ status: 404, description: 'Dil tapılmadı' })
  findAllTranslations(@Param('id') id: string) {
    return this.languageService.findAllTranslations(+id);
  }

  // @Get(':id/translations/group/:group')
  // @ApiResponse({ status: 200, description: 'Qrup tərcümələri qaytarılır' })
  // @ApiResponse({ status: 404, description: 'Dil tapılmadı' })
  // getTranslationsByGroup(
  //   @Param('id') id: string,
  //   @Param('group') group: string
  // ) {
  //   return this.languageService.getTranslationsByGroup(+id, group);
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch(':id/translations/:translationId')
  @ApiResponse({ status: 200, description: 'Tərcümə uğurla yeniləndi' })
  @ApiResponse({ status: 400, description: 'Yanlış məlumat' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  @ApiResponse({ status: 404, description: 'Tərcümə tapılmadı' })
  updateTranslation(
    @Param('translationId') translationId: string,
    @Body() updateTranslationDto: UpdateTranslationDto
  ) {
    return this.languageService.updateTranslation(+translationId, updateTranslationDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id/translations/:translationId')
  @ApiResponse({ status: 200, description: 'Tərcümə uğurla silindi' })
  @ApiResponse({ status: 401, description: 'İcazəsiz giriş' })
  @ApiResponse({ status: 403, description: 'Yetərsiz səlahiyyət' })
  @ApiResponse({ status: 404, description: 'Tərcümə tapılmadı' })
  removeTranslation(@Param('translationId') translationId: string) {
    return this.languageService.removeTranslation(+translationId);
  }
} 