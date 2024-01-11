import { ValidationError } from '@nestjs/common';
export function errorFormatter(errors: ValidationError[], errMessage?: Record<string, string> | [], parentField?: string) {
  const message: Record<string, string> | [] = errMessage || {};
  let errorField = '';
  let validationsList;
  errors.forEach((error) => {
    errorField = parentField ? `${parentField}.${error.property}` : error?.property;
    if (!error?.constraints && error?.children?.length) {
      errorFormatter(error.children, message, errorField);
    } else {
      validationsList = Object.values(error?.constraints || {});
      //  using object
      // message.push(validationsList.length > 0 ? errorField + ', ' + validationsList.pop() : 'Invalid Value!');
      const errorMessage = validationsList.length > 0 ? validationsList.pop() : 'Invalid Value!';
      message[errorField] = errorMessage;
    }
  });
  return message;
}
