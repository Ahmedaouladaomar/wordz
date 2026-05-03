import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { ApiConfigService } from '@/shared/services/api-config.service';
import { Template } from './interfaces/template.interface';
import { WelcomeTemplate } from './interfaces/welcome.template';
import { VerifyEmailTemplate } from './interfaces/verify-email.template';
import { PasswordRecoveryTemplate } from './interfaces/password-recovery.template';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ApiConfigService) {
    const { resendApiKey } = this.configService.emailConfig;
    this.resend = new Resend(resendApiKey);
  }

  async sendEmail(to: string, template: Template) {
    const { emailFrom } = this.configService.emailConfig;
    const from = `Wordz <${emailFrom}>`;

    try {
      const { data, error } = await this.resend.emails.send({
        from,
        to,
        subject: template.subject,
        html: template.html,
      });

      if (error) {
        this.logger.error(`Resend Error: ${JSON.stringify(error)}`);
        return;
      }

      this.logger.log(`Email sent successfully: ${data?.id}`);
    } catch (error) {
      this.logger.error(`Network/System Error sending email to ${to}`, error);
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    const template = new WelcomeTemplate(name);
    await this.sendEmail(to, template);
  }

  async sendVerificationEmail(to: string, name: string, code: string) {
    const template = new VerifyEmailTemplate(name, code);
    await this.sendEmail(to, template);
  }

  async sendPasswordRecoveryEmail(to: string, name: string, code: string) {
    const template = new PasswordRecoveryTemplate(name, code);
    await this.sendEmail(to, template);
  }
}
