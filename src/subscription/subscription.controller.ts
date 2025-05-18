import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { CreateSubscriptionDto } from './dto/subscription.dto';
import { TokenDto } from './dto/token.dto';
import { SubscriptionService } from './subscription.service';

@Controller('')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('subscribe')
  @ApiOperation({
    summary: 'Subscribe to weather updates',
    description:
      'Subscribe an email to receive weather updates for a specific city with chosen frequency.',
  })
  @ApiCreatedResponse({
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
  @ApiOkResponse({
    example: 'Subscription confirmed successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    schema: {
      example: {
        message: ['Invalid token'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    example: 'Token not found',
  })
  async confirm(@Param() params: TokenDto) {
    return await this.subscriptionService.confirmToken(params.token);
  }

  @Get('unsubscribe/:token')
  @ApiOperation({
    summary: 'Unsubscribe from weather updates',
    description:
      'Unsubscribes an email from weather updates using the token sent in emails.',
  })
  @ApiOkResponse({
    example: 'Unsubscribed successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
    schema: {
      example: {
        message: ['Invalid token'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    example: 'Token not found',
  })
  async unsubscribe(@Param() params: TokenDto) {
    return await this.subscriptionService.unsubscribe(params.token);
  }
}
