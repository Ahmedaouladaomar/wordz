import { Template } from './template.interface';
import { renderTemplate } from './template-renderer';

export abstract class BaseEmailTemplate implements Template {
  abstract subject: string;
  protected abstract templateName: string;
  protected abstract templateContext(): Record<string, unknown>;

  get html(): string {
    return renderTemplate(this.templateName, this.templateContext());
  }
}
