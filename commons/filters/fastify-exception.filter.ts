import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus, BadRequestException } from '@nestjs/common';
import { ValidationException } from '../exceptions';
import { FastifyReply } from 'fastify';

@Catch()
export class ExceptionBaseFilter implements ExceptionFilter {
  catch(exception: ValidationException | HttpException, host: ArgumentsHost) {
    const logger: Logger = new Logger(exception.name || ExceptionBaseFilter.name);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : ((typeof exception['statusCode'] == 'number' ? exception['statusCode'] : HttpStatus.INTERNAL_SERVER_ERROR) as number);

    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    const { message, ...data } = typeof exception['message'] == 'object' ? exception['message'] : { message: exception['message'] ?? '-' };

    // cek jika itu error validation
    if (exception instanceof BadRequestException && Array.isArray(exception.getResponse()['message'])) data['errors'] = exception.getResponse()['message'];

    // jika berasal dari CustomValidationException
    if (exception instanceof ValidationException) data['errors'] = exception.getErrors();

    if (exception['errors']) data['errors'] = exception['errors'];

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR || process.env.NODE_ENV !== 'production') logger.error(message);

    reply.status(status).send({
      message: message,
      ...data,
    });
  }
}
