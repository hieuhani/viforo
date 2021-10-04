import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  type: 'postgresql' | 'mysql';
  dbName: string;
  port: number;
  user: string;
}

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    type: 'postgresql',
    dbName: 'viforo',
    port: 5432,
    user: 'viforo',
  })
);
