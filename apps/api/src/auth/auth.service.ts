import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SecurityConfig } from '../config/security.config';
import { EncryptionService } from '../encryption/encryption.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { SignUpInput, Token } from './auth.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
  ) {}

  generateToken(payload: { accountId: string }): Token {
    const accessToken = this.jwtService.sign(payload);

    const securityConfig = this.configService.get<SecurityConfig>('security');
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
      const { accountId } = this.jwtService.verify(token);

      return this.generateToken({
        accountId,
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
      accountId: account.id,
    });
  }

  async signUp(input: SignUpInput): Promise<Token> {
    input.email = input.email.toLowerCase();

    const user = await this.userService.createUser(input);
    return this.generateToken({
      accountId: user.id,
    });
  }
}
