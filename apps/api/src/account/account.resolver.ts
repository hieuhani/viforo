import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Account } from '../account/account.type';

@Resolver(() => Account)
export class AccountResolver {
  @ResolveField()
  fullName(@Parent() account: Account): string {
    return [account.firstName, account.lastName].filter(Boolean).join(' ');
  }
}
