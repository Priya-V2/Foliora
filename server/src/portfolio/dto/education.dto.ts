import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Education } from '../../generated/prisma';

export class CreateEducationDto {
  @ApiProperty({ example: 'University of California, Berkeley' })
  @IsString()
  @MaxLength(200)
  @Transform(({ value }: { value: string }) => value?.trim())
  institution!: string;

  @ApiProperty({ example: 'B.S. in Computer Science' })
  @IsString()
  @MaxLength(200)
  @Transform(({ value }: { value: string }) => value?.trim())
  degree!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  fieldOfStudy?: string;

  @ApiProperty({ required: false, example: 3.8 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  cgpa?: number;

  @ApiProperty({ example: '2014-08-01' })
  @IsISO8601()
  startDate!: string;

  @ApiProperty({ required: false, example: '2018-05-01' })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}

export class UpdateEducationDto extends PartialType(CreateEducationDto) {}

export class EducationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  institution: string;

  @ApiProperty()
  degree: string;

  @ApiProperty({ nullable: true })
  fieldOfStudy: string | null;

  @ApiProperty({ nullable: true })
  cgpa: number | null;

  @ApiProperty()
  startDate: Date;

  @ApiProperty({ nullable: true })
  endDate: Date | null;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  displayOrder: number;

  constructor(education: Education) {
    this.id = education.id;
    this.institution = education.institution;
    this.degree = education.degree;
    this.fieldOfStudy = education.fieldOfStudy;
    this.cgpa = education.cgpa;
    this.startDate = education.startDate;
    this.endDate = education.endDate;
    this.description = education.description;
    this.displayOrder = education.displayOrder;
  }
}
