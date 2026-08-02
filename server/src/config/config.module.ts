import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import authConfig from './auth.config';
import mailConfig from './mail.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, mailConfig],
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
