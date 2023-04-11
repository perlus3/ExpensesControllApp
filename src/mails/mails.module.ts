import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailsService } from './mails.service';
import { config } from '../configs/config';

const TEMPLATE_DIR = __dirname + '/templates/';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: config.MAIL_HOST,
        secure: true,
        auth: {
          user: config.MAIL_USER,
          pass: config.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <mailbox.expenseapp@gmail.com>',
      },
      template: {
        dir: TEMPLATE_DIR,
        adapter: new EjsAdapter({
          inlineCssEnabled: true,
        }),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
