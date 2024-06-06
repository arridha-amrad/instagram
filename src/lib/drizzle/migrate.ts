import "dotenv/config";

import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
const sql = neon(process.env.DB_URL!);
const db = drizzle(sql, {
  schema,
});

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: "src/lib/drizzle/migrations",
    });
    console.log("migration successful 🔥");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

main();
