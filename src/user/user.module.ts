import { Module } from '@nestjs/common';
import { UserService } from './bll/user.service';

@Module({
  providers: [UserService],
})
export class UserModule {}
