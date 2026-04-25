import { BaseEmailTemplate } from './base-email.template';

export class PasswordRecoveryTemplate extends BaseEmailTemplate {
  subject = 'Reset Your Password';
  protected templateName = 'password-recovery';

  constructor(
    private name: string,
    private resetLink: string,
  ) {
    super();
  }

  protected templateContext(): Record<string, unknown> {
    return {
      name: this.name,
      resetLink: this.resetLink,
    };
  }
}
