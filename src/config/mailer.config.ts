import { MailerOptions } from '@nestjs-modules/mailer';

export const mailerConfig: MailerOptions = {
  transport: {
    host: 'smtp.sendgrid.net',
    auth: {
      user: 'apikey',
      pass: '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',
    },
  },
};
