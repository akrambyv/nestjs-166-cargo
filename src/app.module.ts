import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { OrderModule } from './modules/order/order.module';
import { TariffModule } from './modules/tariff/tariff.module';
import { SettingsModule } from './modules/setting/setting.module';
import { CloudinaryModule } from './libs/cloudinary/cloudinary.module';
import DataSource from './config/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ContentModule } from './modules/content/content.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { PaymentModule } from './modules/payment/payment.module';
import { LanguageModule } from './modules/language/language.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DataSource.options),
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
    ThrottlerModule.forRoot([
      {
        limit: 5,
        ttl: 10000,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UserModule,
    AuthModule,
    OrderModule,
    TariffModule,
    SettingsModule,
    CloudinaryModule,
    ContentModule,
    TrackingModule,
    PaymentModule,
    LanguageModule,
  ],
  controllers: [AppController],
  providers: [AppService, {provide: APP_GUARD, useClass: ThrottlerGuard}],
})
export class AppModule { }