import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
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
            console.log(`Error code: ${error.code}`);
            console.log(`Error status: ${error.status}`);

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
