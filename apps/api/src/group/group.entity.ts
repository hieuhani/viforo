import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../user/user.entity';

@Entity()
export class Group {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property({ nullable: true })
  color?: string;

  @Property({ nullable: true })
  icon?: string;

  @Property()
  default = false;

  @ManyToMany(() => User)
  users = new Collection<User>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
