import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '123456789', type: String, required: true })
  id!: bigint;

  @ApiProperty({ example: 'Lorem', type: String, required: false })
  name!: string;

  @ApiProperty({ example: 'Lorem', type: String, required: false })
  roleType!: string;

  constructor(data: UserResponseDto) {
    Object.assign(this, data);
  }
}
