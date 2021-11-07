import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UserUpdatePayloadDto {
  @ApiProperty({ example: 'Lorem', required: true, type: String })
  @IsString()
  @Length(3, 50)
  name!: string;
}
