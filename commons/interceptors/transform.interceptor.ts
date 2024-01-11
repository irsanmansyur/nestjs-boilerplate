import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((result) => {
        const response = context.switchToHttp().getResponse();
        if (!result) {
          response.statusCode = HttpStatus.NO_CONTENT;
          return;
        }
        const { statusCode = 200, message = 'informasi endpoint api disini', ...result2 } = result;
        let { data = null, ...respon } = result2;
        if (typeof result == 'string') {
          data = result;
          respon = [];
        }
        response.statusCode = statusCode;
        return {
          message: message,
          data: data || respon,
          ...(data ? respon : {}),
        };
      })
    );
  }
}
