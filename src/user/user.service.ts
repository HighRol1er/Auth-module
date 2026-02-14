import type { DB } from '@/db/db.module';
import type { NewUser, User } from '@/db/schema';

import { users } from '@/db/schema';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  private readonly userSchema = users;
  private readonly logger = new Logger();
  constructor(@Inject('DATABASE') private readonly db: DB) {}

  async findUser(email: string): Promise<User | undefined> {
    const [existingUser] = await this.db.select().from(this.userSchema).where(eq(users.email, email));
    return existingUser;
  }

  async findOrCreateUser(data: NewUser) {
    const existingUser = await this.findUser(data.email);

    if (existingUser) return existingUser;

    const [newUser] = await this.db.insert(users).values(data).returning();

    return newUser;
  }
}
