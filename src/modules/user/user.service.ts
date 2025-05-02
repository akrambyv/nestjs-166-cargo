import { Injectable, NotFoundException, ForbiddenException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Not } from 'typeorm';
import { UserEntity } from '../../entities/User.entity';
import { UserRole } from './user.types';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private emailService: EmailService
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ users: Partial<UserEntity>[], total: number }> {
    const [users, total] = await this.userRepo.findAndCount({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        gender: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      order: {
        createdAt: 'DESC'
      },
      skip: (page - 1) * limit,
      take: limit
    });

    return {
      users,
      total
    };
  }

  async findById(id: number): Promise<Partial<UserEntity>> {
    const user = await this.userRepo.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);

    }
    
    Object.assign(user, updateUserDto);
    await this.userRepo.save(user);
    
    const { password, ...result } = user;
    return result as UserEntity;
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    await this.userRepo.remove(user);
  }

  async findByEmail(email: string): Promise<Partial<UserEntity>> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }


  async setRole(id: number, role: UserRole, currentUser: UserEntity): Promise<UserEntity> {
    const targetUser = await this.findById(id);
    
    if (currentUser.id === targetUser.id) {
      throw new ForbiddenException('You cannot change your own role');
    }

    if (targetUser.role === UserRole.ADMIN && currentUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can change admin roles');
    }

    if (currentUser.role !== UserRole.SUPER_ADMIN && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to change roles');
    }

    targetUser.role = role;
    return this.userRepo.save(targetUser);
  }
  
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepo.findOne({ 
      where: { id: userId },
      select: ['id', 'password'] 
    });
    
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mevcut şifre yanlış');
    }

    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('Yeni şifreler eşleşmiyor');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userRepo.update(userId, { password: hashedPassword });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.findByEmail(forgotPasswordDto.email);
    
    if (!user.email || !user.id) {
      throw new NotFoundException('Kullanıcı email adresi bulunamadı');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);
    
    await this.userRepo.update(user.id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: new Date(Date.now() + 3600000) // 1 saat
    });

    await this.emailService.sendPasswordResetEmail(user.email, token);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    console.log('Gelen token:', resetPasswordDto.token);

    const user = await this.userRepo.findOne({
      where: {
        resetPasswordExpires: MoreThan(new Date())
      }
    });

    if (!user || !user.id) {
      console.log('Kullanıcı bulunamadı veya token süresi dolmuş');
      throw new BadRequestException('Keçərsiz və ya vaxtı dolmuş token');
    }

    console.log('Kullanıcı bulundu:', user.email);
    console.log('Kayıtlı token:', user.resetPasswordToken);

    const isTokenValid = await bcrypt.compare(resetPasswordDto.token, user.resetPasswordToken);
    console.log('Token doğrulama sonucu:', isTokenValid);

    if (!isTokenValid) {
      throw new BadRequestException('Keçərsiz token');
    }

    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Yeni şifrələr uyğunlaşmır');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    await this.userRepo.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: '',
      resetPasswordExpires: new Date()
    });
  }
}
