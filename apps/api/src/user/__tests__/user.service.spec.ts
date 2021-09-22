import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@upbuilder/prisma';
import { mockDeep } from 'jest-mock-extended';
import { AuthService } from 'src/auth/auth.service';
import securityConfig from 'src/config/security.config';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { EncryptionService } from 'src/encryption/encryption.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { prismaUserFactory } from 'src/test/prisma/user.factory';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;
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
        UserService,
        ConfigService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaClient>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    encryptionService = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('#createUser success ', async () => {
    const password = 'password';
    const hashedPassword = 'hashed_password';

    const user = prismaUserFactory.createUser({
      password: hashedPassword,
    });

    jest
      .spyOn(encryptionService, 'hash')
      .mockImplementation(() => Promise.resolve(hashedPassword));

    (prismaService.user.create as jest.Mock).mockResolvedValue(user);

    const createdUser = await service.createUser({
      ...user,
      password,
    });

    expect(createdUser).toBeDefined();
  });
});
