import { pgTable, integer, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  provider: text().notNull(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  picture: text(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 조회용 타입 (DB에서 읽어온 결과물)
export type User = InferSelectModel<typeof users>;

// 삽입용 타입 (새 유저를 만들 때 필요한 값들)
export type NewUser = InferInsertModel<typeof users>;
