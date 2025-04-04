import { timestamp, uuid, text, pgTable } from "drizzle-orm/pg-core";

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text("text").notNull(),
  // createdAt: timestamp("created_at").defaultNow(),
});
