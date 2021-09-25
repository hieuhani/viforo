import { ObjectType, ID, Field } from '@nestjs/graphql';

@ObjectType()
export class Account  {
  @Field((type) => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  emailVerified: boolean;

  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  avatar?: string;
}
