
import { Module } from '@nestjs/common';
import { MailService } from 'src/modules/mail/mail.service';
import { AuthController } from 'src/modules/user/auth/auth.controller';
import { AuthService } from 'src/modules/user/auth/auth.service';
import { PrismaModule } from 'src/prisma/prisma.modul';
import { LoginHistoryRepository } from 'src/share/repository/login-history.repository';
import { TokenRepository } from 'src/share/repository/token.repository';
import { UserRepository } from 'src/share/repository/user.repository';
import { RandomTokenService } from 'src/share/service/random-token.service';
import { UserIdService } from 'src/share/service/user-id.service';
import { PasswordUtils } from 'src/share/utils/password.utils';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, PasswordUtils, MailService, RandomTokenService, TokenRepository, UserIdService, LoginHistoryRepository],
})
export class AuthModule {}
