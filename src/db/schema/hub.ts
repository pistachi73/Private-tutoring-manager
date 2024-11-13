import { relations } from "drizzle-orm";
import { integer, pgEnum, serial, text } from "drizzle-orm/pg-core";
import { clientHub } from "./client-hub";
import { pgTable } from "./utils";

export const scheduleTypeEnum = pgEnum("schedule_type", [
  "on-demand",
  "recurrent",
]);

export const hub = pgTable("hub", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  scheduleType: scheduleTypeEnum().notNull(),
  defaultSessionPrice: integer("default_session_price").notNull(),
  cancelationPolicyHours: integer("cancelation_policy_hours").notNull(),
});

export type InsertHub = typeof hub.$inferInsert;
export type Hub = typeof hub.$inferSelect;

export const hubRelations = relations(hub, ({ many }) => ({
  clients: many(clientHub),
}));