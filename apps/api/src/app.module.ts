import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DateScalar } from './common/scalar/date.scalar';
import graphqlConfig, { GraphqlConfig } from './config/graphql.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import securityConfig from './config/security.config';
import { EncryptionModule } from './encryption/encryption.module';
import databaseConfig, { DatabaseConfig } from './config/database.config';
import { AccountModule } from './account/account.module';
import { User } from './user/user.entity';
import { Group } from './group/group.entity';
import { Account } from './account/account.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [securityConfig, graphqlConfig, databaseConfig],
    }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const graphql = configService.get<GraphqlConfig>('graphql');
        return {
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          sortSchema: graphql.sortSchema,
          autoSchemaFile: graphql.schemaDestination,
          debug: graphql.debug,
          playground: graphql.playgroundEnabled,
        };
      },
      inject: [ConfigService],
    }),
    MikroOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          entities: [User, Group, Account],
          ...configService.get<DatabaseConfig>('database'),
        };
      },
      inject: [ConfigService],
    }),
    EncryptionModule,
    AccountModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [DateScalar],
})
export class AppModule {}
