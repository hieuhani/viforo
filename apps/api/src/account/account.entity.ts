import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { IsEmail } from 'class-validator';
import { AccountRepository } from './account.repository';

@Entity()
export class Account {
  @PrimaryKey()
  id: string = v4();

  @Property()
  username: string;

  @Property()
  @IsEmail()
  email: string;

  @Property()
  emailVerified = false;

  @Property()
  firstName: string;

  @Property({ nullable: true })
  lastName?: string;

  @Property({ hidden: true })
  password: string;

  @Property({ nullable: true })
  avatar?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  [EntityRepositoryType]?: AccountRepository;
}
