import { NestFactory } from '@nestjs/core';
import compression from '@fastify/compress';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ExceptionBaseFilter } from 'src/commons/filters/fastify-exception.filter';
import { TransformInterceptor } from 'src/commons/interceptors';
import { CustomValidationPipe } from 'src/commons/pipes';
import { useHelmet } from 'src/commons/helmet';
import { useSwagger } from 'src/commons/swagger';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: 30 * 1024 * 1024, // Default Limit set to 30MB,
    }),
  );

  //masih bingun tapi pernah dapat bug validator, pakai ini solusinya
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalFilters(new ExceptionBaseFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new CustomValidationPipe());

  useHelmet(app);
  useSwagger(app);

  //   Middleware kompresi  Gzip
  await app.register(compression);

  const port = parseInt(process.env.PORT || '3000');
  await app.listen(port, '0.0.0.0', (_, address) => {
    console.log(`-------- ======  W 3 L C 0 M 3  ======== -------\n\turl\t: ${address}\n-------- ======  _ $ T A R T _  ======== -------`);
  });
}
bootstrap();
