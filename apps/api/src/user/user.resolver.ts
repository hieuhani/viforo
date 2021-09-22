import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './user.type';
import { CurrentUser } from '../auth/current-user.decorator';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver((of) => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  @Query((returns) => User)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
