import { DatabaseService } from './database.service';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (databaseService: DatabaseService) => {
      const sequelize = databaseService.getSequalize();
      sequelize.addModels([]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [DatabaseService],
  },
];
//
