import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { User } from './user.entity';

export enum FrequencyUpdatesEnum {
  HOURLY = 'hourly',
  DAILY = 'daily',
}

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions)
  user: User;

  @ApiProperty({
    example: 'Kyiv',
    description: 'City for weather updates',
  })
  @IsString()
  @Column()
  city: string;

  @ApiProperty({
    example: FrequencyUpdatesEnum.HOURLY,
    enum: FrequencyUpdatesEnum,
    description: 'Frequency of updates (hourly or daily)',
  })
  @IsEnum(FrequencyUpdatesEnum)
  @Transform(({ value }) => value.toLowerCase())
  @Column()
  frequency: string;

  @ApiProperty({ example: '12345678', description: 'Confirmation token' })
  @IsString()
  @Column()
  token: string;

  @ApiProperty({ example: false, description: 'Email confirmed' })
  @IsBoolean()
  @Column()
  emailConfirmed: boolean;
}
