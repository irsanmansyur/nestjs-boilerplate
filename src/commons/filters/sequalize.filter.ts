import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { UniqueConstraintError } from 'sequelize';
import { FastifyReply } from 'fastify';

@Catch(UniqueConstraintError)
export class SequelizeExceptionFilter implements ExceptionFilter {
  logger = new Logger(SequelizeExceptionFilter.name);
  catch(exception: UniqueConstraintError, host: ArgumentsHost) {
    this.logger.error(exception.original?.message.split('\n')[0] || ' already exists');
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    const { message, ...data } = typeof exception['message'] == 'object' ? exception['message'] : { message: exception['message'] ?? '-' };

    reply.status(500).send({
      message: message,
      ...data,
    });
  }
}
