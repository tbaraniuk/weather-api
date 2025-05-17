import { of } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { WeatherService } from './weather.service';
import { AxiosHeaders, AxiosResponse } from 'axios';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('It should return weather data for a valid city', async () => {
    const mockData = {
      location: { name: 'Kyiv' },
      current: { temp_c: 20, humidity: 10, condition: { test: 'Sunny' } },
    };

    const axiosResponse: AxiosResponse = {
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(axiosResponse));

    const result = await service.fetchWeatherData('Kyiv');
    expect(result).toEqual(mockData);
  });
});
