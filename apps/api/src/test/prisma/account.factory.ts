import { Account } from '@prisma/client';
import faker from 'faker';

export const prismaAccountFactory = {
  createAccount(props?: Partial<Account>): Account {
    return {
      id: Math.floor(Math.random() * 1000).toString(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      emailVerified: false,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(),
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: faker.image.avatar(),
      ...props,
    };
  },
};
