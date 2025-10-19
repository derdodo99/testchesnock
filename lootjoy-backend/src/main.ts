import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from '@src/app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://your-miniapp-domain.example', 'https://web.telegram.org'], // подставь домен mini-app / tg webview origin(s)
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
