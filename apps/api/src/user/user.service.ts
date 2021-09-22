import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client'
import { EncryptionService } from '../encryption/encryption.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './user.type';

@Injectable()
export class UserService {
  constructor(
    private readonly encryptionService: EncryptionService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async createUser(payload: CreateUserInput): Promise<User> {
    const hashedPassword = await this.encryptionService.hash(payload.password);

    return this.prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
      },
    });
  }
}
