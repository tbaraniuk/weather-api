import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import {
  WeatherNotFoundResponseDto,
  WeatherOkResponseDto,
} from './dto/weather-response.dto';
import { WeatherService } from './weather.service';
import { CityDto } from './dto/city.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation({
    summary: 'Get current weather for a city',
    description:
      'Returns the current weather forecast for the specified city using WeatherAPI.com.',
  })
  @ApiOkResponse({
    type: WeatherOkResponseDto,
    description: 'Successful operation - current weather forecast returned',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    schema: {
      example: {
        message: ['City name must not contain digits'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    type: WeatherNotFoundResponseDto,
    description: 'City not found',
  })
  async getCurrentWeather(
    @Query() queries: CityDto,
  ): Promise<WeatherOkResponseDto> {
    const data = await this.weatherService.fetchWeatherData(queries.city);

    const response = {
      temperature: data?.current?.temp_c,
      humidity: data?.current?.humidity,
      description: data?.current?.condition?.text ?? '',
    };

    return response;
  }
}
