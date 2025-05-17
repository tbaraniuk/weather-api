import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

import {
  WeatherNotFoundResponseDto,
  WeatherOkResponseDto,
} from './dto/weather-response.dto';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation({
    summary: 'Get current weather for a city',
    description:
      'Returns the current weather forecast for the specified city using WeatherAPI.com.',
  })
  @ApiQuery({
    name: 'city',
    type: String,
    description: 'City name for weather forecast',
  })
  @ApiOkResponse({
    type: WeatherOkResponseDto,
    description: 'Successful operation - current weather forecast returned',
  })
  @ApiNotFoundResponse({
    type: WeatherNotFoundResponseDto,
    description: 'City not found',
  })
  async getCurrentWeather(
    @Query('city') city: string,
  ): Promise<WeatherOkResponseDto> {
    try {
      const data = await this.weatherService.fetchWeatherData(city);

      const response = {
        temperature: data?.current?.temp_c,
        humidity: data?.current?.humidity,
        description: data?.current?.condition?.text,
      };

      return response;
    } catch (error) {
      throw error;
    }
  }
}
