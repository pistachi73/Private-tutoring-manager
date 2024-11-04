import { hashPassword } from "@/data-access/utils";
import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import clients from "./data/clients.seed-data";

export default async function seed(db: DB) {
  await Promise.all(
    clients.map(async (client) => {
      const { password, ...rest } = client;
      const { hashedPassword, salt } = await hashPassword(password);

      await db.insert(schema.client).values({
        ...rest,
        password: hashedPassword,
        salt,
      });
    }),
  );
}