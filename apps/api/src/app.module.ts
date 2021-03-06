import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { DateScalar } from './common/scalar/date.scalar';
import graphqlConfig, { GraphqlConfig } from './config/graphql.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import securityConfig from './config/security.config';
import { PrismaModule } from './prisma/prisma.module';
import { EncryptionModule } from './encryption/encryption.module';
import databaseConfig from './config/database.config';
import { AccountModule } from './account/account.module';

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
    PrismaModule,
    EncryptionModule,
    UserModule,
    AuthModule,
    AccountModule,
  ],
  controllers: [],
  providers: [DateScalar],
})
export class AppModule {}
