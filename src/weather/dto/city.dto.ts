import { PickType } from '@nestjs/swagger';
import { Subscription } from '../../subscription/entities/subscription.entity';

export class CityDto extends PickType(Subscription, ['city'] as const) {}
