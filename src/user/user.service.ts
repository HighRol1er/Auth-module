import { Inject, Injectable } from '@nestjs/common';

import { usersTable } from 'src/db/schema';

import type { DB } from 'src/db/db.module';

@Injectable()
export class UserService {
  constructor(@Inject('DATABASE') private readonly db: DB) {}

  async insertUser(): Promise<void> {
    await this.db.insert(usersTable).values({
      name: 'John Doe',
      age: 20,
      email: 'john.doe@example.com',
    });
  }

  async getUsers(): Promise<any> {
    const users = await this.db.select().from(usersTable);
    return users;
  }
}
