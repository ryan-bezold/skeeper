import {config} from "dotenv";
import {DataSource} from "typeorm";

config(); // load .env when running CLI locally

export default new DataSource({
   type: 'postgres',
   host: process.env.DATABASE_HOST,
   port: parseInt(process.env.DATABASE_PORT || '5432'),
   username: process.env.DATABASE_USER,
   password: process.env.DATABASE_PASSWORD,
   database: process.env.DATABASE_NAME,
   entities: ['src/infrastructure/database/entities/*.typeorm-entity.ts'],
   migrations: ['src/migrations/*.ts'],
 });