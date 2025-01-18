import { Pool } from "@neondatabase/serverless";
import { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle, NeonQueryResultHKT } from "drizzle-orm/neon-serverless";
import { PgTransaction } from "drizzle-orm/pg-core";
import * as schema from "./schema";

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
