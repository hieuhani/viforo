import { EntityRepository, Repository } from '@mikro-orm/core';
import { Account } from './account.entity';

@Repository(Account)
export class AccountRepository extends EntityRepository<Account> {}
