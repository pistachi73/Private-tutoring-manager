import { integer, pgEnum, serial, text, timestamp } from "drizzle-orm/pg-core";
import { pgTable } from "./utils";

export const paymentFrequencyEnum = pgEnum("payment_frequency", [
  "one-time",
  "monthly",
]);

export const timeInvestmentEnum = pgEnum("time_investment", [
  "low",
  "medium",
  "high",
]);

export const client = pgTable("client", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  salt: text("salt").notNull(),
  image: text("image"),
  paymentFrequency: paymentFrequencyEnum().default("monthly"),
  location: text("location"),
  nationality: text("nationality"),
  age: integer("age"),
  timeInvestment: timeInvestmentEnum().default("medium"),
  job: text("job"),
  awayUntil: timestamp("away_until", { mode: "date" }),
});

export type InsertClient = typeof client.$inferInsert;
export type Client = typeof client.$inferSelect;