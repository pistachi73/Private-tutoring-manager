import { relations } from "drizzle-orm";
import { pgEnum, serial, text, timestamp } from "drizzle-orm/pg-core";
import { session } from "./session";
import { pgTable } from "./utils";

export const sessionExceptionReasonEnum = pgEnum("session_exception_reason", [
  "cancelled",
  "skip",
  "reschedule",
]);

export const sessionException = pgTable("session_exception", {
  id: serial("id").primaryKey(),
  sessionId: serial("session_id").references(() => session.id, {
    onDelete: "cascade",
  }),
  exceptionDate: timestamp("exception_date", { mode: "string" }).notNull(),
  reason: sessionExceptionReasonEnum().notNull(),
  newStartTime: timestamp("new_start_time", { mode: "string" }),
  newEndTime: timestamp("new_end_time", { mode: "string" }),
  timezone: text("timezone").default("UTC"),
  comments: text("comments"),
});

export const sessionExceptionRelations = relations(
  sessionException,
  ({ one }) => ({
    session: one(session, {
      fields: [sessionException.sessionId],
      references: [session.id],
    }),
  }),
);

export type InsertSessionException = typeof sessionException.$inferInsert;
export type SessionException = typeof sessionException.$inferSelect;
export type SessionExceptionReason = SessionException["reason"];
