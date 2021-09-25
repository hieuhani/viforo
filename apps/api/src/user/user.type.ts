import { ObjectType, Field } from '@nestjs/graphql';
import { BaseModel } from '../common/base.model';

@ObjectType()
export class User extends BaseModel {
  @Field()
  accountId: string;
}
