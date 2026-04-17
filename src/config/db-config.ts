import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { env } from './env';

export const typeOrmConfigs = () => {
  const obj: PostgresConnectionOptions = {
    type: 'postgres',
    host: env.DB_HOST,
    uuidExtension: 'uuid-ossp',
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    // schema: env.POSTGRES_SCHEMA,
    // logging: env.NODE_ENV === 'development',
    entities: [join(__dirname, '/../**/**.entity{.ts,.js}')],
    migrations: [join(__dirname, '/../database/migrations/*.{ts,js}')],
    subscribers: [
      join(__dirname, `/../database/subscribers/**.subscriber.{ts,js}`),
    ],
    synchronize: env.DB_SYNCHRONIZE,
  };

  return obj;
};
