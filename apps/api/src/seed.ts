import { Logger } from '@nestjs/common';
import { v4 } from 'uuid';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import securityConfig from './config/security.config';
import { PrismaModule } from './prisma/prisma.module';
import { EncryptionModule } from './encryption/encryption.module';
import databaseConfig from './config/database.config';
import { AccountModule } from './account/account.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { EncryptionService } from './encryption/encryption.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [securityConfig, databaseConfig],
    }),
    PrismaModule,
    EncryptionModule,
    UserModule,
    AuthModule,
    AccountModule,
  ],
  controllers: [],
})
export class SeedModule {}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    SeedModule,
    new FastifyAdapter()
  );
  const prismaService = app.get(PrismaService);
  const encryptionService = app.get(EncryptionService);

  Logger.log('Start seeding default user groups');
  await prismaService.group.createMany({
    data: [{ name: 'Administrator' }, { name: 'Member', default: true }],
  });

  Logger.log('Start seeding admin user');
  const hashedPassword = await encryptionService.hash('super!password');
  const accountId = v4();
  await prismaService.$transaction([
    prismaService.account.create({
      data: {
        id: accountId,
        username: 'hieuhani',
        email: 'hieutran.fu@gmail.com',
        firstName: 'Hieu',
        lastName: 'Tran',
        password: hashedPassword,
      },
    }),
    prismaService.user.create({
      data: {
        accountId,
      },
    }),
  ]);

  const adminUser = await prismaService.user.findUnique({
    where: {
      accountId,
    },
  });

  const adminGroup = await prismaService.group.findFirst({
    where: {
      name: 'Administrator',
    },
  });

  await prismaService.groupUser.create({
    data: {
      userId: adminUser.id,
      groupId: adminGroup.id,
    },
  });

  app.close();
}

bootstrap();
