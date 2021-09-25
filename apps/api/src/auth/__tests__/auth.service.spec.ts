import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import securityConfig from '../../config/security.config';
import { EncryptionModule } from '../../encryption/encryption.module';
import { EncryptionService } from '../../encryption/encryption.service';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaAccountFactory } from '../../test/prisma/account.factory';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let encryptionService: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EncryptionModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [securityConfig],
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secretOrPrivateKey: 'secretKey',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaClient>(),
        },
        ConfigService,
        EncryptionService,
        UserService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    encryptionService = module.get<EncryptionService>(EncryptionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('#generateToken should generated a token object', () => {
    const token = service.generateToken({ sub: 'useriduuid' });
    expect(token.accessToken).toBeDefined();
    expect(token.refreshToken).toBeDefined();
    expect(token.accessToken).not.toEqual(token.refreshToken);
  });

  describe('#login', () => {
    it('login with correct username and password', async () => {
      const password = 'password';
      const user = prismaAccountFactory.createAccount({
        password: await encryptionService.hash(password),
      });

      (prismaService.account.findUnique as jest.Mock).mockResolvedValue(user);

      const token = await service.login(user.username, password);
      expect(token.accessToken).toBeDefined();
      expect(token.refreshToken).toBeDefined();
      expect(token.accessToken).not.toEqual(token.refreshToken);
    });

    it('login with not found username should raise an exception', async () => {
      const user = prismaAccountFactory.createAccount();
      const password = 'password';
      (prismaService.account.findUnique as jest.Mock).mockResolvedValue(null);

      try {
        await service.login(user.username, password);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e).toEqual(
          new NotFoundException(`No account found for username: ${user.username}`),
        );
      }
    });
  });

  describe('#refreshToken', () => {
    it('refresh token with a valid refresh token', () => {
      const token = service.generateToken({ sub: 'useriduuid' });
      expect(service.refreshToken(token.refreshToken)).toBeDefined();
    });

    it('refresh token with an invalid refresh token should throw an unauthorized error', () => {
      try {
        service.refreshToken('invalid_token');
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
