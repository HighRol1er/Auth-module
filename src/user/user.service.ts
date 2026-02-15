import type { DB } from '@/db/db.module';
import type { NewUser, User } from '@/db/schema';

import { users } from '@/db/schema';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  private readonly userSchema = users;
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

  async findOneById(id: number) {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0]; // 유저 정보 반환
  }

  async updateRefreshToken(id: number, refreshToken: string | null) {
    await this.db.update(users).set({ refreshToken }).where(eq(users.id, id));
  }
}
