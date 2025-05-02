import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { UserRole } from '../user/user.types';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContentEntity } from '../../entities/Content.entity';

@ApiTags('contents')
@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiResponse({ status: 200, description: 'Bütün məzmunlar', type: [ContentEntity] })
  @Get()
  findAll() {
    return this.contentService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Tapılan məzmun', type: ContentEntity })
  @ApiResponse({ status: 404, description: 'Məzmun tapılmadı' })
  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.contentService.findByKey(key);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiResponse({ status: 201, description: 'İçerik oluşturuldu', type: ContentEntity })
  @Post()
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiResponse({ status: 200, description: 'İçerik güncellendi', type: ContentEntity })
  @ApiResponse({ status: 404, description: 'İçerik bulunamadı' })
  @Patch(':key')
  update(@Param('key') key: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(key, updateContentDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiResponse({ status: 200, description: 'Məzmun silindi' })
  @ApiResponse({ status: 404, description: 'Məzmun tapılmadı' })
  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.contentService.remove(key);
  }
}