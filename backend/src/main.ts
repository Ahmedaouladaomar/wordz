import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ApiConfigService } from './shared/services/api-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ApiConfigService);
  const port = configService.appConfig.port || 4000;

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const transformInterceptor = new TransformInterceptor();

  app.useGlobalInterceptors(transformInterceptor);

  await app.listen(port, '0.0.0.0');
}
bootstrap();
