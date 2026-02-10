import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DbModule, UserModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
