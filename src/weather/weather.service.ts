import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name, {
    timestamp: true,
  });

  constructor(private readonly httpService: HttpService) {}

  async fetchWeatherData(city: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`https://api.weatherapi.com/v1/current.json`, {
          params: {
            key: process.env.WEATHER_API_KEY,
            q: city,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`Error code: ${error.code}`);
            this.logger.error(`Error status: ${error.status}`);

            if (error.status == 400) {
              throw new NotFoundException('City not found');
            }

            throw error;
          }),
        ),
    );

    return data;
  }
}
