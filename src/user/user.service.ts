import type { DB } from '@/db/db.module';

import { Injectable, Inject } from '@nestjs/common';
import { NewUser, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// This should be a real class/interface representing a user entity

@Injectable()
export class UserService {
  private readonly userSchema = users;
  constructor(@Inject('DATABASE') private readonly db: DB) {}

  async findOrCreateUser(data: NewUser) {
    const [existingUser] = await this.db.select().from(this.userSchema).where(eq(users.email, data.email));

    if (existingUser) return existingUser;

    const [newUser] = await this.db.insert(users).values(data).returning();

    return newUser;
  }
}
