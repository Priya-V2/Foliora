import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';
import { Achievement } from '../../generated/prisma';

export class CreateAchievementDto {
  @ApiProperty({ example: 'Speaker at React Summit 2023' })
  @IsString()
  @MaxLength(200)
  @Transform(({ value }: { value: string }) => value?.trim())
  title!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ required: false, example: 'Top 1% contributor' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  metric?: string;

  @ApiProperty({ required: false, example: '2023-06-15' })
  @IsOptional()
  @IsISO8601()
  achievedAt?: string;
}

export class UpdateAchievementDto extends PartialType(CreateAchievementDto) {}

export class AchievementResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ nullable: true })
  metric: string | null;

  @ApiProperty({ nullable: true })
  achievedAt: Date | null;

  @ApiProperty()
  displayOrder: number;

  constructor(achievement: Achievement) {
    this.id = achievement.id;
    this.title = achievement.title;
    this.description = achievement.description;
    this.metric = achievement.metric;
    this.achievedAt = achievement.achievedAt;
    this.displayOrder = achievement.displayOrder;
  }
}
