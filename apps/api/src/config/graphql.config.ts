import { registerAs } from '@nestjs/config';

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export default registerAs(
  'graphql',
  (): GraphqlConfig => ({
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  }),
);
