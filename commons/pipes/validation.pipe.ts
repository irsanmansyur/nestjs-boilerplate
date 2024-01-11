import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions';
import { errorFormatter } from 'commons/helpers';

export class CustomValidationPipe implements PipeTransform {
  async transform(value: Record<string, string | number | object | []>, { metatype }: ArgumentMetadata) {
    if (!value && metatype) {
      throw new ValidationException('Validation failed', []);
    }

    if (!metatype || !this.toValidate(metatype)) {
      return value.data || value;
    }

    Object.entries(value).forEach(([key, vl]) => {
      if (typeof vl != 'string') return;

      const isNumb = Number(vl);
      if (isNaN(isNumb)) return;

      value[key] = isNumb;
    });

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new ValidationException('Validation failed', errorFormatter(errors));
    }
    return value;
  }

  private toValidate(metatype: object): boolean {
    const types: object[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
