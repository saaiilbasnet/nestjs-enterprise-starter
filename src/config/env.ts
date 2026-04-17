import * as dotenv from 'dotenv';

dotenv.config();
export const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || 'dev',

  JWT_EXPIRE: process.env.JWT_EXPIRE || '1d',
  JWT_SECRET: process.env.JWT_SECRET,

  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_USERNAME: process.env.DB_USERNAME || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || '123',
  DB_DATABASE: process.env.DB_DATABASE || 'resturant-db',
  DB_SCHEMA: process.env.DB_SCHEMA,
  DB_SYNCHRONIZE: Boolean(process.env.DB_SYNCHRONIZE) || false,

  MAIL_USERNAME: process.env.MAIL_USERNAME,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
};
