import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './user.type';
import { CurrentUser } from '../auth/current-user.decorator';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account.type';

@Resolver((of) => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query((returns) => User)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @ResolveField(() => Account)
  async account(@Parent() user: User): Promise<Account> {
    const account = await this.accountService.getAccount(user.accountId);
    return {
      id: account.id,
      username: account.username,
      email: account.email,
      emailVerified: account.emailVerified,
      firstName: account.firstName,
      lastName: account.lastName,
    };
  }
}
