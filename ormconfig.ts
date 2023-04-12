/* eslint-disable prettier/prettier */
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const config = {
  type: 'postgres' as 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  autoLoadEntities: true,
  synchronize: true,
  migrations: ['src/database/migrations/*{.ts,.js}'],
};

export default config;
