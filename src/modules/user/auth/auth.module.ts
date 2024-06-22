import { Module } from '@nestjs/common';
import { AuthController } from 'src/modules/user/auth/auth.controller';
import { AuthService } from 'src/modules/user/auth/auth.service';
import { PrismaModule } from 'src/prisma/prisma.modul';
import { UserRepository } from 'src/share/repository/user.repository';
import { PasswordUtils } from 'src/share/utils/password.utils';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, PasswordUtils],
})
export class AuthModule {}
