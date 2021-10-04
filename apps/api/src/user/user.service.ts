import { EntityData } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getUserByAccountId(accountId: string): Promise<User> {
    return this.repository.findOne({
      accountId,
    });
  }

  async create(account: EntityData<User>): Promise<User> {
    return this.repository.create(account);
  }
}
