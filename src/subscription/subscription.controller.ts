import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('')
  async listAll() {
    return await this.subscriptionService.listAllSubscriptions();
  }

  @Get('users')
  async listAllUsers() {
    return await this.subscriptionService.listAllUsers();
  }

  @Post('subscribe')
  @ApiOperation({
    summary: 'Subscribe to weather updates',
    description:
      'Subscribe an email to receive weather updates for a specific city with chosen frequency.',
  })
  @ApiOkResponse({
    example: 'Subscription successful. Confirmation email sent.',
  })
  @ApiConflictResponse({ example: 'Email already subscribed' })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email'],
        error: 'Bad Request',
      },
    },
  })
  async subscribe(@Query() createSubscriptionDto: CreateSubscriptionDto) {
    return await this.subscriptionService.create(createSubscriptionDto);
  }

  @Get('confirm/:token')
  @ApiOperation({
    summary: 'Confirm email subscription',
    description:
      'Confirms a subscription using the token sent in the confirmation email.',
  })
  async confirm(@Param('token') token: string) {
    return await this.subscriptionService.confirmToken(token);
  }

  @Get('unsubscribe/:token')
  @ApiOperation({
    summary: 'Unsubscribe from weather updates',
    description:
      'Unsubscribes an email from weather updates using the token sent in emails.',
  })
  async unsubscribe(@Param('token') token: string) {
    return await this.subscriptionService.unsubscribe(token);
  }
}
