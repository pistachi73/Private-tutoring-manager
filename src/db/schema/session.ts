import type { RecurrenceRule } from "@/components/ui/recurrence-select";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { attendance } from "./attendance";
import { hub } from "./hub";
import { type SessionException, sessionException } from "./session-exception";
import { pgTable } from "./utils";

export const session = pgTable("session", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  hubId: serial("hub_id")
    .notNull()
    .references(() => hub.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time", { mode: "date" }).notNull(),
  endTime: timestamp("end_time", { mode: "date" }).notNull(),
  price: integer("price").notNull(),
  isRecurring: boolean("is_recurring").default(false),
  recurrenceRule: jsonb("recurrence_rule").$type<RecurrenceRule | null>(),
});

export const sessionRelations = relations(session, ({ one, many }) => ({
  hub: one(hub, {
    fields: [session.hubId],
    references: [hub.id],
  }),
  attendances: many(attendance),
  exceptions: many(sessionException),
}));

export type InsertSession = typeof session.$inferInsert;
export type Session = typeof session.$inferSelect & {
  exceptions?: SessionException[];
};
