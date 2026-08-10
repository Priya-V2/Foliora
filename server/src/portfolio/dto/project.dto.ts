import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Project } from '../../generated/prisma';

export class CreateProjectDto {
  @ApiProperty({ example: 'Velo Analytics Dash' })
  @IsString()
  @MaxLength(150)
  @Transform(({ value }: { value: string }) => value?.trim())
  title!: string;

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
  techStack?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({ require_protocol: false })
  @MaxLength(300)
  githubUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({ require_protocol: false })
  @MaxLength(300)
  demoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({ require_protocol: false })
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ type: [String] })
  techStack: string[];

  @ApiProperty({ nullable: true })
  githubUrl: string | null;

  @ApiProperty({ nullable: true })
  demoUrl: string | null;

  @ApiProperty({ nullable: true })
  imageUrl: string | null;

  @ApiProperty()
  featured: boolean;

  @ApiProperty()
  displayOrder: number;

  constructor(project: Project) {
    this.id = project.id;
    this.title = project.title;
    this.description = project.description;
    this.techStack = project.techStack;
    this.githubUrl = project.githubUrl;
    this.demoUrl = project.demoUrl;
    this.imageUrl = project.imageUrl;
    this.featured = project.featured;
    this.displayOrder = project.displayOrder;
  }
}
