import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';
import { SecurityConfig } from '../config/security.config';

@Injectable()
export class EncryptionService {
  constructor(private readonly configService: ConfigService) {}

  get bcryptSaltRounds(): string | number {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return securityConfig.bcryptSaltOrRound;
  }
  validateHash(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  hash(password: string): Promise<string> {
    return hash(password, this.bcryptSaltRounds);
  }
}
