import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async getUserByAccountId(accountId: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        accountId,
      }
    });
  }
}
