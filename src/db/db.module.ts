import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Module, Global, OnModuleDestroy, Inject } from '@nestjs/common';
import { Pool } from 'pg';

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
  useFactory: () => drizzle(pool, { schema }),
};

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE',
      useFactory: () => drizzle(pool, { schema }),
    },
    {
      provide: 'POOL',
      useValue: pool,
    },
  ],
  exports: ['DATABASE', 'POOL'],
})
export class DbModule implements OnModuleDestroy {
  constructor(@Inject('POOL') private readonly pool: Pool) {}

  async onModuleDestroy() {
    await this.pool.end(); // 앱 종료 시 풀 닫기
    console.log('DB Pool connection closed.');
  }
}
