import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, token: string, id: string) {
    const url = process.env.DOMAIN_FONTEND + `authentication/${token}/${id}`;

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

  async sendEmailForgotPassword(email: string, token: string, id: string) {
    const url = process.env.DOMAIN_FONTEND + `forgot-password/${token}/${id}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Quên mật khẩu',
      template: './forgot-password.hbs',
      context: {
        name: email,
        url,
      },
    });
  }
}