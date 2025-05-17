import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class TokenDto {
  @ApiProperty({ description: 'Confirmation token' })
  @IsString({
    message: 'Invalid token',
  })
  @Matches(/^\d{8}$/, {
    message: 'Invalid token',
  })
  token: string;
}
