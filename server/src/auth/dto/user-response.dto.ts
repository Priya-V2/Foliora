import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from '../../generated/prisma';

// Explicit field selection rather than a serializer interceptor: keeps the
// "never return passwordHash" guarantee visible at the call site instead of
// depending on every future User field remembering to opt out.
export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty({ nullable: true })
  avatar: string | null;

  @ApiProperty()
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.isVerified = user.isVerified;
    this.avatar = user.avatar;
    this.createdAt = user.createdAt;
  }
}
