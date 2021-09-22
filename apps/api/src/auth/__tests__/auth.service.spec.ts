import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@upbuilder/prisma';
import { mockDeep } from 'jest-mock-extended';
import securityConfig from 'src/config/security.config';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { EncryptionService } from 'src/encryption/encryption.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { prismaUserFactory } from 'src/test/prisma/user.factory';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
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
    const token = service.generateToken({ userId: 1 });
    expect(token.accessToken).toBeDefined();
    expect(token.refreshToken).toBeDefined();
    expect(token.accessToken).not.toEqual(token.refreshToken);
  });

  describe('#login', () => {
    it('login with correct email and password', async () => {
      const password = 'password';
      const user = prismaUserFactory.createUser({
        password: await encryptionService.hash(password),
      });

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);

      const token = await service.login(user.email, password);
      expect(token.accessToken).toBeDefined();
      expect(token.refreshToken).toBeDefined();
      expect(token.accessToken).not.toEqual(token.refreshToken);
    });

    it('login with not found email should raise an exception', async () => {
      const user = prismaUserFactory.createUser();
      const password = 'password';
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      try {
        await service.login(user.email, password);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e).toEqual(
          new NotFoundException(`No user found for email: ${user.email}`),
        );
      }
    });
  });

  describe('#refreshToken', () => {
    it('refresh token with a valid refresh token', () => {
      const token = service.generateToken({ userId: 1 });
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
