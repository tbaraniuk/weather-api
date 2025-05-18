import { Test, TestingModule } from '@nestjs/testing';

import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

describe('WeatherController', () => {
  let controller: WeatherController;

  const mockWeatherService = {
    fetchWeatherData: jest.fn().mockResolvedValue({
      temperature: 20,
      humidity: 20,
      description: 'Sunny',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [WeatherService],
    })
      .overrideProvider(WeatherService)
      .useValue(mockWeatherService)
      .compile();

    controller = module.get<WeatherController>(WeatherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return current weather', async () => {
    const city = 'Kyiv';

    await controller.getCurrentWeather({ city: city });

    expect(mockWeatherService.fetchWeatherData).toHaveBeenCalledWith(city);
  });
});
