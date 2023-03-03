import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { config } from './config';
import { DataSource } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { AccountsEntity } from '../entities/accounts.entity';
import { IncomeEntity } from '../entities/income.entity';
import { ExpensesEntity } from '../entities/expenses.entity';
import { RefreshTokensEntity } from '../entities/refresh-tokens.entity';

const entities = [
  UsersEntity,
  AccountsEntity,
  IncomeEntity,
  ExpensesEntity,
  RefreshTokensEntity,
];

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: config.TYPEORM_HOST,
  port: parseInt(config.TYPEORM_PORT || '3306'),
  username: config.TYPEORM_USERNAME,
  password: config.TYPEORM_PASSWORD,
  database: config.TYPEORM_DATABASE,
  entities: entities,
  migrations: ['src/migrations'],
  synchronize: config.TYPEORM_SYNC,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
