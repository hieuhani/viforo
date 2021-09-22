import { registerAs } from '@nestjs/config';

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: number;
  jwtSecret: string;
}

export default registerAs(
  'security',
  (): SecurityConfig => ({
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
    jwtSecret: 'Fu2020ck',
  }),
);
