import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { config } from './config';
import { DataSource } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { AccountsEntity } from '../entities/accounts.entity';
import { CashFlowEntity } from '../entities/cash-flow.entity';
import { RefreshTokensEntity } from '../entities/refresh-tokens.entity';
import { CategoriesEntity } from '../entities/categories.entity';

const entities = [
  UsersEntity,
  AccountsEntity,
  CashFlowEntity,
  RefreshTokensEntity,
  CategoriesEntity,
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
