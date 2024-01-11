import * as mongoose from 'mongoose';
import { getEnvVariable } from 'src/commons/helpers';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => mongoose.connect(getEnvVariable('MONGO_URL')),
  },
];
