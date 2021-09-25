import { Inject, Injectable } from '@nestjs/common';
import { Account } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async getAccount(accountId: string): Promise<Account> {
    return this.prisma.account.findUnique({
      where: {
        id: accountId,
      }
    });
  }
}
