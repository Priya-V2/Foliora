import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import aiConfig from './ai.config';
import authConfig from './auth.config';
import githubConfig from './github.config';
import mailConfig from './mail.config';
import resumeConfig from './resume.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig, mailConfig, resumeConfig, aiConfig, githubConfig],
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
