import { EntityData } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: AccountRepository
  ) {}

  async getAccount(accountId: string): Promise<Account> {
    return this.accountRepository.findOne({
      id: accountId,
    });
  }

  async getAccountByUsername(username: string): Promise<Account> {
    return this.accountRepository.findOne({
      username,
    });
  }

  async create(account: EntityData<Account>): Promise<Account> {
    return this.accountRepository.create(account);
  }
}
