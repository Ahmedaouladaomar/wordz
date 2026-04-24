import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';

// Loading .env file based on the current NODE_ENV (e.g., .env.development, .env.production)
config({ path: join(__dirname, `../../.env.${NODE_ENV}`) });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // Look for entities anywhere in the src tree
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  // Look for migrations in the folder right next to this file
  migrations: [join(__dirname, './migrations/*{.ts,.js}')],
  synchronize: false, // Always false for production/migrations!
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
