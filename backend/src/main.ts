import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ApiConfigService } from './shared/services/api-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ApiConfigService);
  const port = configService.appConfig.port || 4000;

  const transformInterceptor = new TransformInterceptor();

  app.useGlobalInterceptors(transformInterceptor);
  app.use(cookieParser());

  await app.listen(port);
}
bootstrap();
