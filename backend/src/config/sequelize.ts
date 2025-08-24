import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import appConfig from './config';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: appConfig.db.host,
  port: appConfig.db.port,
  database: appConfig.db.name,
  username: appConfig.db.user,
  password: appConfig.db.password,
  logging: false,
  dialectOptions: appConfig.db.ssl
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  models: [__dirname + '/../models/**/*.{ts,js}'],
});