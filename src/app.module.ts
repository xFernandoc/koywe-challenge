import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './env.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      validate,
    }),
    MongooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configureService: ConfigService) => {
      return {
        uri: configureService.get('DB_URL'),
        autoIndex: true,
      };
    },
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
