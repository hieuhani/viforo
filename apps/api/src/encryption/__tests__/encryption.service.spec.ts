import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import securityConfig from '../../config/security.config';
import { EncryptionService } from '../encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [securityConfig],
        }),
      ],
      providers: [EncryptionService, ConfigService],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('#hashPassword should make a hashed password and #validatePassword can verify password', async () => {
    const password = 'dummy_password';
    const hashedPassword = await service.hash(password);
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
    expect(await service.validateHash(password, hashedPassword)).toBeTruthy();

    expect(
      await service.validateHash('not_a_password', hashedPassword),
    ).toBeFalsy();
  });
});
