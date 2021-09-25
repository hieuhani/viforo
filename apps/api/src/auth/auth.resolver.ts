import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { Auth, LoginInput, SignUpInput, Token } from './auth.type';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async signUp(@Args('input') input: SignUpInput) {
    const { accessToken, refreshToken } = await this.authService.signUp(input);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async signIn(@Args('input') { username, password }: LoginInput) {
    const { accessToken, refreshToken } = await this.authService.login(
      username.toLowerCase(),
      password,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args('token') token: string) {
    return this.authService.refreshToken(token);
  }
}
