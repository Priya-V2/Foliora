import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { CurrentUserData } from '../auth/types/current-user.interface';
import { ResumeResponseDto } from './dto/resume-response.dto';
import { ResumeService } from './resume.service';

@ApiTags('resume')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  getResume(
    @CurrentUser() user: CurrentUserData,
  ): Promise<ResumeResponseDto | null> {
    return this.resumeService.getResume(user.id);
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  uploadResume(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ResumeResponseDto> {
    return this.resumeService.uploadResume(user.id, file);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteResume(@CurrentUser() user: CurrentUserData): Promise<void> {
    await this.resumeService.deleteResume(user.id);
  }
}
