import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async listAllSubscriptions() {
    return await this.subscriptionsRepository.find({});
  }

  async listAllUsers() {
    return await this.usersRepository.find({});
  }

  async create(data: CreateSubscriptionDto) {
    try {
      console.log(data);

      const existedSubscription = await this.subscriptionsRepository.findOne({
        where: {
          user: {
            email: data?.email,
          },
          city: data?.city.toLowerCase(),
        },
      });

      console.log(existedSubscription);

      if (existedSubscription?.id) {
        throw new ConflictException('Email already subscribed');
      }

      let user = await this.usersRepository.findOne({
        where: {
          email: data.email,
        },
      });

      if (!user?.id) {
        user = new User();
        user.email = data.email;

        await this.usersRepository.save(user);
      }

      const subscription = new Subscription();

      subscription.user = user;
      subscription.city = data.city.toLowerCase();
      subscription.frequency = data.frequency;
      subscription.token = this.generate8DigitToken();

      await this.subscriptionsRepository.save(subscription);

      return `Subscription successful. Confirmation email sent.\nYour token: ${subscription.token}`;
    } catch (error) {
      throw error;
    }
  }

  generate8DigitToken(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  async confirmToken(token: string) {
    try {
      const subscription = await this.subscriptionsRepository.findOne({
        where: {
          token: token,
        },
      });

      if (!subscription.id) {
        throw new NotFoundException('Token not found');
      }

      subscription.emailConfirmed = true;

      await this.subscriptionsRepository.save(subscription);

      return 'Subscription confirmed successfully';
    } catch (error) {
      throw error;
    }
  }

  async unsubscribe(token: string) {
    try {
      const subscription = await this.subscriptionsRepository.findOne({
        where: {
          token: token,
        },
      });

      if (!subscription.id) {
        throw new NotFoundException('Token not found');
      }

      await this.subscriptionsRepository.delete({
        token: token,
      });

      return 'Unsubscribed successfully';
    } catch (error) {
      throw error;
    }
  }
}
