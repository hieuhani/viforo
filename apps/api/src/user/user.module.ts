import { Module } from '@nestjs/common';
import { EncryptionModule } from '../encryption/encryption.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [EncryptionModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
