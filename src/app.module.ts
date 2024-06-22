import { AuthModule } from './modules/user/auth/auth.module';
import { AuthController } from './modules/user/auth/auth.controller';
import { AuthService } from './modules/user/auth/auth.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.modul';

@Module({
  imports: [
        AuthModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
