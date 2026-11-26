import { neon } from "@neondatabase/serverless";
import { env } from "#config/env.js";
import { logger } from "#lib/logger.js";

/**
 * `sql` is a tagged template function: values interpolated with ${} are sent
 * as query parameters, so they are safe from SQL injection.
 *
 *   const rows = await sql`SELECT * FROM products WHERE id = ${id}`;
 *
 * When no database is configured, every query throws a descriptive error
 * instead of crashing the whole server at startup.
 */
export const sql = env.databaseUrl
  ? neon(env.databaseUrl)
  : () => {
      throw new Error(
        "Database is not configured. Set DATABASE_URL or PGUSER/PGPASSWORD/PGHOST/PGDATABASE in .env",
      );
    };

export const isDatabaseConfigured = Boolean(env.databaseUrl);

export async function checkDatabase() {
  if (!isDatabaseConfigured) return false;
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    logger.error("Database connection failed:", error.message);
    return false;
  }
}
