import { IntersectionType, PickType } from '@nestjs/swagger';

import { Subscription } from '../entities/subscription.entity';
import { User } from '../entities/user.entity';

export class CreateSubscriptionDto extends PickType(
  IntersectionType(Subscription, User),
  ['email', 'city', 'frequency'] as const,
) {}
