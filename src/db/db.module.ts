import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Module, Global } from '@nestjs/common';
import { Client, Pool } from 'pg';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema'; // Your Drizzle schema files

// The type for your fully configured Drizzle DB instance
export type DB = NodePgDatabase<typeof schema>;
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const dbProvider = {
  provide: 'DATABASE',
  useFactory: () =>
    drizzle({
      connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: false,
      },
    }),
};

@Global()
@Module({
  providers: [dbProvider],
  exports: ['DATABASE'],
})
export class DbModule {}
