import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  url: string;
}

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    url: 'postgresql://viforo@localhost:5432/viforo?schema=public',
  }),
);
