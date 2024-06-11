import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DB_URL });

const db = drizzle(pool, {
  schema,
  logger: true,
});

export default db;
