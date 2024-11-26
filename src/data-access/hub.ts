import { db } from "@/db";
import { hub } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getHubsByUserId = async (userId: string) => {
  return await db.query.hub.findMany({
    where: eq(hub.userId, userId),
    with: {
      sessions: {
        with: {
          exceptions: true,
        },
      },
    },
  });
};

export const getCalendarHubsByUserId = async (userId: string) => {
  return await db.query.hub.findMany({
    // where: eq(hub.userId, userId),
    with: {
      sessions: {
        with: {
          exceptions: true,
        },
      },
    },
  });
};