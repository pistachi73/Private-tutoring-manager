import { relations } from "drizzle-orm";
import { integer, pgEnum, serial, text, timestamp } from "drizzle-orm/pg-core";
import { attendance } from "./attendance";
import { clientHub } from "./client-hub";
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
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  password: text().notNull(),
  salt: text().notNull(),
  image: text(),
  paymentFrequency: paymentFrequencyEnum().default("monthly"),
  location: text(),
  nationality: text(),
  age: integer("age"),
  timeInvestment: timeInvestmentEnum().default("medium"),
  job: text(),
  awayUntil: timestamp({ mode: "date" }),
});

export type InsertClient = typeof client.$inferInsert;
export type Client = typeof client.$inferSelect;

export const clientRelations = relations(client, ({ many }) => ({
  clientHub: many(clientHub),
  attendances: many(attendance),
}));
