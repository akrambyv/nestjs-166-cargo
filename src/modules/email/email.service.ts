import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const smtpPort = process.env.SMTP_PORT || '465';
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      throw new Error('SMTP istifadəçi adı və şifrəsi lazımdır');
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER;

    if (!smtpFrom) {
      throw new Error('SMTP göndərən adresi lazımdır');
    }

    const resetUrl = `${frontendUrl}/reset-password.html?token=${token}`;
    
    console.log('Reset URL:', resetUrl);
    console.log('Token:', token);
    
    const mailOptions = {
      from: smtpFrom,
      to: email,
      subject: 'Şifrə Sıfırlama',
      html: `
        <h1>Şifrə Sıfırlama</h1>
        <p>Şifrənizi sıfırlamak üçün aşağıdakı linkə girin:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Bu link 1 saat üçün keçərlidir.</p>
        <p>Parolun sıfırlanmasını tələb etməmisinizsə, bu e-mail'i görməzdən gələ bilərsiniz.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
} 