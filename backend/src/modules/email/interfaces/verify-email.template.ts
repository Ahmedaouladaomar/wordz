import { BaseEmailTemplate } from './base-email.template';

export class VerifyEmailTemplate extends BaseEmailTemplate {
  subject = 'Verify Your Email Address';
  protected templateName = 'verify-email';

  constructor(
    private name: string,
    private verificationCode: string,
  ) {
    super();
  }

  protected templateContext(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.verificationCode,
    };
  }
}
