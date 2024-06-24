import { AuthModule } from './modules/user/auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.modul';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/share/constants/jwt.constants';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from 'src/modules/mail/mail.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
