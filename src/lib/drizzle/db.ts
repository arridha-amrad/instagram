import { Pool } from "@neondatabase/serverless";
import { drizzle, NeonQueryResultHKT } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import { PgTransaction } from "drizzle-orm/pg-core";
import { ExtractTablesWithRelations } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DB_URL });

export const db = drizzle(pool, {
  schema,
});

export type DrizzleDatabase = typeof db;
export type DrizzleTransactionDatabase = PgTransaction<
  NeonQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
