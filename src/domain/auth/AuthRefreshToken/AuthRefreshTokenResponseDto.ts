import { ApiProperty } from '@nestjs/swagger';

export class AuthRefreshTokenResponseDto {
  @ApiProperty({ example: '123456789', type: String, required: true })
  id!: bigint;

  @ApiProperty({ example: 'fddb97bf-92ca-413e-9b20-2029acb92d7c', type: String, required: true })
  sessionId!: string;

  @ApiProperty({ example: '1624457335', type: String, required: false })
  iat?: number;

  @ApiProperty({ example: '1624460935', type: String, required: false })
  exp?: number;
}
