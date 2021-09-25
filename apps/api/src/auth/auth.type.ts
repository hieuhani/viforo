import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/client';

@ObjectType()
export class Token {
  @Field({ description: 'JWT access token' })
  accessToken: string;

  @Field({ description: 'JWT refresh token' })
  refreshToken: string;
}

@InputType()
export class SignUpInput {
  @Field()
  @IsDefined()
  username: string;

  @Field()
  @IsEmail()
  @IsDefined()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  @IsDefined()
  password: string;

  @Field()
  @IsDefined()
  firstName: string;

  @Field({ nullable: true })
  @IsOptional()
  lastName?: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsDefined()
  username: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  @IsDefined()
  password: string;
}

@ObjectType()
export class Auth extends Token {
  user: User;
}

export interface JwtDto {
  userId: number;
}

export type JwtPayload = {
  sub: string
  iat: number
  exp: number
}
