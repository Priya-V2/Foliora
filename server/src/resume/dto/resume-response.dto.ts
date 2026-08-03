import { ApiProperty } from '@nestjs/swagger';
import { Resume, ResumeStatus } from '../../generated/prisma';

export class ResumeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: 'Original file name as uploaded by the user' })
  fileName: string;

  @ApiProperty()
  fileType: string;

  @ApiProperty({ description: 'File size in bytes' })
  fileSize: number;

  @ApiProperty({ enum: ResumeStatus })
  status: ResumeStatus;

  @ApiProperty()
  uploadedAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(resume: Resume) {
    this.id = resume.id;
    this.fileName = resume.fileName;
    this.fileType = resume.fileType;
    this.fileSize = resume.fileSize;
    this.status = resume.status;
    this.uploadedAt = resume.uploadedAt;
    this.updatedAt = resume.updatedAt;
  }
}
