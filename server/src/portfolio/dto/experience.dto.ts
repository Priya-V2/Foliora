import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Experience } from '../../generated/prisma';

export class CreateExperienceDto {
  @ApiProperty({ example: 'TechFlow Systems' })
  @IsString()
  @MaxLength(150)
  @Transform(({ value }: { value: string }) => value?.trim())
  company!: string;

  @ApiProperty({ example: 'Senior Frontend Engineer' })
  @IsString()
  @MaxLength(150)
  @Transform(({ value }: { value: string }) => value?.trim())
  role!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  technologies?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  achievements?: string[];

  @ApiProperty({ example: '2021-01-01' })
  @IsISO8601()
  startDate!: string;

  @ApiProperty({ required: false, example: '2023-12-31' })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  current?: boolean;
}

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}

export class ExperienceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  role: string;

  @ApiProperty({ nullable: true })
  location: string | null;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ type: [String] })
  technologies: string[];

  @ApiProperty({ type: [String] })
  achievements: string[];

  @ApiProperty()
  startDate: Date;

  @ApiProperty({ nullable: true })
  endDate: Date | null;

  @ApiProperty()
  current: boolean;

  @ApiProperty()
  displayOrder: number;

  constructor(experience: Experience) {
    this.id = experience.id;
    this.company = experience.company;
    this.role = experience.role;
    this.location = experience.location;
    this.description = experience.description;
    this.technologies = experience.technologies;
    this.achievements = experience.achievements;
    this.startDate = experience.startDate;
    this.endDate = experience.endDate;
    this.current = experience.current;
    this.displayOrder = experience.displayOrder;
  }
}
