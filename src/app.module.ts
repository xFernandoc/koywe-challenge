import { Module } from '@nestjs/common';
import { validate } from './env.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { QuoteModule } from './quote/quote.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configureService: ConfigService) => {
        return {
          uri: configureService.get('DB_URL'),
          autoIndex: true,
        };
      },
    }),
    AuthModule,
    UserModule,
    QuoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
