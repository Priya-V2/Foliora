import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Certification } from '../../generated/prisma';

export class CreateCertificationDto {
  @ApiProperty({ example: 'AWS Certified Solutions Architect' })
  @IsString()
  @MaxLength(200)
  @Transform(({ value }: { value: string }) => value?.trim())
  title!: string;

  @ApiProperty({ example: 'Amazon Web Services' })
  @IsString()
  @MaxLength(150)
  @Transform(({ value }: { value: string }) => value?.trim())
  issuer!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  credentialId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({ require_protocol: false })
  @MaxLength(300)
  credentialUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsISO8601()
  issueDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({ require_protocol: false })
  @MaxLength(500)
  logoUrl?: string;
}

export class UpdateCertificationDto extends PartialType(
  CreateCertificationDto,
) {}

export class CertificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  issuer: string;

  @ApiProperty({ nullable: true })
  credentialId: string | null;

  @ApiProperty({ nullable: true })
  credentialUrl: string | null;

  @ApiProperty({ nullable: true })
  issueDate: Date | null;

  @ApiProperty({ nullable: true })
  logoUrl: string | null;

  @ApiProperty()
  displayOrder: number;

  constructor(certification: Certification) {
    this.id = certification.id;
    this.title = certification.title;
    this.issuer = certification.issuer;
    this.credentialId = certification.credentialId;
    this.credentialUrl = certification.credentialUrl;
    this.issueDate = certification.issueDate;
    this.logoUrl = certification.logoUrl;
    this.displayOrder = certification.displayOrder;
  }
}
