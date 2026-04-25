import { BaseEmailTemplate } from './base-email.template';

export class WelcomeTemplate extends BaseEmailTemplate {
  subject = 'Welcome to Wordz!';
  protected templateName = 'welcome';

  constructor(private name: string) {
    super();
  }

  protected templateContext(): Record<string, unknown> {
    return { name: this.name };
  }
}
