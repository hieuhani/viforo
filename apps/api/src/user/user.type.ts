import { Optional } from '@nestjs/common';
import { ObjectType, Field, HideField } from '@nestjs/graphql';
import { IsDefined, IsEmail, IsString, MinLength } from 'class-validator';
import { BaseModel } from '../common/base.model';

@ObjectType()
export class User extends BaseModel {
  @Field()
  email: string;

  @Field()
  firstname: string;

  @Field({ nullable: true })
  lastname?: string;

  @HideField()
  password: string;
}

export class CreateUserInput {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @MinLength(1)
  @IsDefined()
  firstName: string;

  @Optional()
  @IsString()
  lastName?: string;

  @IsString()
  @MinLength(6)
  @IsDefined()
  password: string;
}
