import { HttpException, HttpStatus } from '@nestjs/common';

type TErrors = Record<string, string> | Record<string, string>[] | string[];
export class ValidationException extends HttpException {
  name = 'ValidationException';
  private errors: TErrors = [];

  constructor(message: string, errors: TErrors) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
    this.errors = errors;
  }

  getErrors(): TErrors {
    return this.errors;
  }
}
