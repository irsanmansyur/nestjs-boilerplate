import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function getEnvVariable<T = string>(key: string): T {
  try {
    const configService = new ConfigService(); // Instantiate ConfigService
    const value = configService.get<T>(key);
    if (!value) throw new HttpException(`Error retrieving environment variable: ${key}`, HttpStatus.INTERNAL_SERVER_ERROR);
    return value;
  } catch (error) {
    throw new HttpException(`Error retrieving environment variable: ${key}`, HttpStatus.INTERNAL_SERVER_ERROR, {
      cause: error,
    });
  }
}
