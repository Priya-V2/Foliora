import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Skill, SkillCategory } from '../../generated/prisma';

export class CreateSkillDto {
  @ApiProperty({ example: 'React' })
  @IsString()
  @MaxLength(60)
  @Transform(({ value }: { value: string }) => value?.trim())
  name!: string;

  @ApiProperty({ enum: SkillCategory, example: SkillCategory.FRONTEND })
  @IsEnum(SkillCategory)
  category!: SkillCategory;

  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  proficiency?: number;
}

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}

export class SkillResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: SkillCategory })
  category: SkillCategory;

  @ApiProperty({ nullable: true })
  proficiency: number | null;

  @ApiProperty()
  displayOrder: number;

  constructor(skill: Skill) {
    this.id = skill.id;
    this.name = skill.name;
    this.category = skill.category;
    this.proficiency = skill.proficiency;
    this.displayOrder = skill.displayOrder;
  }
}
