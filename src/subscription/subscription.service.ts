import { Repository } from 'typeorm';

import { MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateSubscriptionDto } from './dto/subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { User } from './entities/user.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly mailService: MailerService,
  ) {}

  async create(data: CreateSubscriptionDto) {
    try {
      const existedSubscription = await this.subscriptionsRepository.findOne({
        where: {
          user: {
            email: data?.email,
          },
          city: data?.city.toLowerCase(),
        },
      });

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
      const token = this.generate8DigitToken();

      subscription.user = user;
      subscription.city = data.city.toLowerCase();
      subscription.frequency = data.frequency;
      subscription.token = token;

      await this.subscriptionsRepository.save(subscription);

      await this.sendConfirmationEmail(data.email, token);

      return `Subscription successful. Confirmation email sent`;
    } catch (error) {
      throw error;
    }
  }

  generate8DigitToken(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  async sendConfirmationEmail(email: string, token: string) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Confirm your email to activate weather updates',
      text: `Your confirmation token is: ${token}`,
    });
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
