import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsInt } from 'class-validator';

export class ImportRepositoriesDto {
  @ApiProperty({
    type: [Number],
    description:
      'GitHub repository ids (GithubRepository.repoId) to showcase. An empty array clears the selection without importing anything.',
  })
  @IsArray()
  @ArrayMaxSize(50)
  @IsInt({ each: true })
  repoIds!: number[];
}
