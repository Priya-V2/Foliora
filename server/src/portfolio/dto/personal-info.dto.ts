import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { PersonalInfo } from '../../generated/prisma';

export class UpdatePersonalInfoDto {
  @ApiProperty({ required: false, example: 'Alex Chen' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }: { value: string }) => value?.trim())
  fullName?: string;

  @ApiProperty({ required: false, example: 'Senior Frontend Engineer' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  @Transform(({ value }: { value: string }) => value?.trim())
  role?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  headline?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @ApiProperty({ required: false, example: 'San Francisco, CA (Remote)' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({ require_protocol: false })
  @MaxLength(300)
  website?: string;

  @ApiProperty({ required: false, example: 'Open to opportunities' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  availability?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(80)
  yearsOfExperience?: number;
}

export class PersonalInfoResponseDto {
  @ApiProperty({ nullable: true })
  fullName: string | null;

  @ApiProperty({ nullable: true })
  role: string | null;

  @ApiProperty({ nullable: true })
  headline: string | null;

  @ApiProperty({ nullable: true })
  bio: string | null;

  @ApiProperty({ nullable: true })
  location: string | null;

  @ApiProperty({ nullable: true })
  email: string | null;

  @ApiProperty({ nullable: true })
  phone: string | null;

  @ApiProperty({ nullable: true })
  website: string | null;

  @ApiProperty({ nullable: true })
  availability: string | null;

  @ApiProperty({ nullable: true })
  yearsOfExperience: number | null;

  constructor(personalInfo: PersonalInfo) {
    this.fullName = personalInfo.fullName;
    this.role = personalInfo.role;
    this.headline = personalInfo.headline;
    this.bio = personalInfo.bio;
    this.location = personalInfo.location;
    this.email = personalInfo.email;
    this.phone = personalInfo.phone;
    this.website = personalInfo.website;
    this.availability = personalInfo.availability;
    this.yearsOfExperience = personalInfo.yearsOfExperience;
  }
}
