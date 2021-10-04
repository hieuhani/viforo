import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Account } from './account.entity';
import { AccountResolver } from './account.resolver';
import { AccountService } from './account.service';

@Module({
  imports: [MikroOrmModule.forFeature([Account])],
  providers: [AccountResolver, AccountService],
  exports: [AccountService],
})
export class AccountModule {}
