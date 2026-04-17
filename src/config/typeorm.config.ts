import { DataSource } from 'typeorm';
import { typeOrmConfigs } from './db-config';

export default new DataSource(typeOrmConfigs());
