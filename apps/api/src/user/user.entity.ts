import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Group } from '../group/group.entity';

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Unique()
  @Property()
  accountId: string;

  @ManyToMany(() => Group)
  groups = new Collection<Group>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
