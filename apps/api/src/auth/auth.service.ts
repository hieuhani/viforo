import { v4 } from 'uuid'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import get from 'lodash.get'
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SecurityConfig } from '../config/security.config';
import { EncryptionService } from '../encryption/encryption.service';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpInput, Token } from './auth.type';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService,
  ) {}

  generateToken(payload: { sub: string }): Token {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: securityConfig.expiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: securityConfig.refreshIn,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  refreshToken(token: string): Token {
    try {
      const { sub } = this.jwtService.verify(token);

      return this.generateToken({
        sub,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async login(username: string, password: string): Promise<Token> {
    const account = await this.prisma.account.findUnique({ where: { username } });

    if (!account) {
      throw new NotFoundException(`No account found for username: ${username}`);
    }
    const passwordValid = await this.encryptionService.validateHash(
      password,
      account.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateToken({
      sub: account.id,
    });
  }

  async signUp(input: SignUpInput): Promise<Token> {
    input.email = input.email.toLowerCase();

    const hashedPassword = await this.encryptionService.hash(input.password);
    const accountId = v4()

    try {
      await this.prisma.$transaction([
        this.prisma.account.create({
          data: {
            id: accountId,
            username: input.username,
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            password: hashedPassword,
          },
        }),
        this.prisma.user.create({
          data: {
            accountId,
          }
        })
      ])
    } catch(e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          const property = get(e, 'meta.target[0]')
          throw new BadRequestException(`${property} is existed`);
        }
      }
      throw new BadRequestException('Invalid password');
    }

    return this.generateToken({
      sub: accountId,
    });
  }
}
