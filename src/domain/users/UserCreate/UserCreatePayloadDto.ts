import { ApiProperty } from '@nestjs/swagger';
import { IsLowercase, IsString, Length, MaxLength } from 'class-validator';

export class UserCreatePayloadDto {
  @ApiProperty({ example: 'lorem', type: String })
  @MaxLength(50)
  @IsLowercase()
  username!: string;

  @ApiProperty({ example: '123456@abc' })
  @IsString()
  @Length(6, 50)
  password!: string;

  @ApiProperty({ example: 'Lorem', required: true, type: String })
  @IsString()
  @Length(3, 50)
  name!: string;
}
