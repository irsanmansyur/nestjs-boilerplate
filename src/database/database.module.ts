import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService, ...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
