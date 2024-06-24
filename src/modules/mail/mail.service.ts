import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, token: string, id: string) {
    const url = process.env.DOMAIN_NAME + `api/v1/users/account/authentication/${token}/${id}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Kích hoạt tài khoản',
      template: './transactional.hbs',
      context: {
        name: email,
        url,
      },
    });
  }
}