import { ApiProperty } from '@nestjs/swagger';
import { GithubConnection } from '../../generated/prisma';

export class GithubStatusResponseDto {
  @ApiProperty()
  connected: boolean;

  @ApiProperty({ nullable: true })
  username: string | null;

  @ApiProperty({ nullable: true })
  avatar: string | null;

  @ApiProperty({ nullable: true })
  connectedAt: Date | null;

  @ApiProperty({ nullable: true })
  lastSyncedAt: Date | null;

  constructor(connection: GithubConnection | null) {
    this.connected = Boolean(connection);
    this.username = connection?.username ?? null;
    this.avatar = connection?.avatar ?? null;
    this.connectedAt = connection?.connectedAt ?? null;
    this.lastSyncedAt = connection?.lastSyncedAt ?? null;
  }
}
