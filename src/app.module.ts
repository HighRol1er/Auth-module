import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AdminController } from './nest/admin/admin.controller';

@Module({
  imports: [DbModule, UserModule, AuthModule, AdminModule],
  controllers: [AppController, AdminController],
  providers: [],
})
export class AppModule {}
