import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const counters = sqliteTable("counters", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  count: integer("count").default(0).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Counter = typeof counters.$inferSelect;
export type NewCounter = typeof counters.$inferInsert;
