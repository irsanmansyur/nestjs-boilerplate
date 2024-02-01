import { Injectable } from '@nestjs/common';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { getEnvVariable } from 'src/commons/helpers';

@Injectable()
export class DatabaseService {
  getSequalize() {
    return new Sequelize(this.getSequalizeConfig());
  }
  private getSequalizeConfig(): SequelizeOptions {
    return {
      dialect: getEnvVariable<'mariadb'>('SQL_DB_DIALECT'),
      host: getEnvVariable('SQL_DB_HOST'),
      port: getEnvVariable<number>('SQL_DB_PORT'),
      username: getEnvVariable('SQL_DB_USERNAME'),
      password: getEnvVariable('SQL_DB_PASSWORD'),
      database: getEnvVariable('SQL_DB_DATABASE'),
      logging: false,
      dialectOptions: {
        connectTimeout: 5000,
      },
    };
  }
}
