import { Module } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  providers: [UserResolver, UserService, AccountService],
  exports: [UserService],
})
export class UserModule {}
