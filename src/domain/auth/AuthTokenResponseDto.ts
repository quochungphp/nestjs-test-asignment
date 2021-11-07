import { ApiProperty } from '@nestjs/swagger';

export class AuthAccessTokenResponseDto {
  @ApiProperty({ example: '123456789', type: String, required: true })
  id!: bigint;

  @ApiProperty({ example: 'Lorem', type: String, required: true })
  name!: string | null;

  sessionId!: string | null;

  roleType!: string;

  iat?: number;

  exp?: number;
}
