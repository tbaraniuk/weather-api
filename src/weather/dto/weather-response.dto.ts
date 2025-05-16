import { ApiProperty } from '@nestjs/swagger';

export class WeatherOkResponseDto {
  @ApiProperty({ example: 20, description: 'Temperature in Celsius' })
  temperature: number;

  @ApiProperty({ example: 50, description: 'Himidity percantage' })
  humidity: number;

  @ApiProperty({
    example: 'Sunny',
    description: 'Weather condition description',
  })
  description: string;
}

export class WeatherNotFoundResponseDto {
  @ApiProperty({ example: 'City not found' })
  message: string;
}
