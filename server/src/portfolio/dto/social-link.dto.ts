import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsUrl, MaxLength } from 'class-validator';
import { SocialLink } from '../../generated/prisma';

export class CreateSocialLinkDto {
  @ApiProperty({ example: 'GitHub' })
  @IsString()
  @MaxLength(50)
  @Transform(({ value }: { value: string }) => value?.trim())
  platform!: string;

  @ApiProperty({ example: 'https://github.com/alexchen' })
  @IsUrl({ require_protocol: false })
  @MaxLength(300)
  url!: string;
}

export class UpdateSocialLinkDto extends PartialType(CreateSocialLinkDto) {}

export class SocialLinkResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  platform: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  displayOrder: number;

  constructor(socialLink: SocialLink) {
    this.id = socialLink.id;
    this.platform = socialLink.platform;
    this.url = socialLink.url;
    this.displayOrder = socialLink.displayOrder;
  }
}
