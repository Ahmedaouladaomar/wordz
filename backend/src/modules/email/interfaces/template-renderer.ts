import { readFileSync } from 'fs';
import { join } from 'path';
import hbs from 'hbs';

const templateCache = new Map<string, any>();

export function renderTemplate(templateFileName: string, context: Record<string, unknown>) {
  const templatePath = join(__dirname, `../templates/${templateFileName}.hbs`);
  let compiled = templateCache.get(templatePath);

  if (!compiled) {
    const templateSource = readFileSync(templatePath, 'utf-8');
    compiled = (hbs as any).handlebars.compile(templateSource);
    templateCache.set(templatePath, compiled);
  }

  return compiled(context);
}
