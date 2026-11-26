import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { z } from "zod";

// The single source of truth for environment variables is the root `.env`
// (shared with the frontend). Values already present in process.env win.
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
dotenv.config({ path: path.join(rootDir, ".env"), quiet: true });

const emptyToUndefined = (value) => (value === "" ? undefined : value);
const optionalString = z.preprocess(emptyToUndefined, z.string().optional());

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.preprocess(emptyToUndefined, z.string().default("http://localhost:5173")),

  DATABASE_URL: optionalString,
  PGUSER: optionalString,
  PGPASSWORD: optionalString,
  PGHOST: optionalString,
  PGDATABASE: optionalString,

  ARCJET_KEY: optionalString,
  ARCJET_ENV: optionalString,
  ARCJET_MODE: z.preprocess(emptyToUndefined, z.enum(["LIVE", "DRY_RUN"]).optional()),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", z.flattenError(parsed.error).fieldErrors);
  process.exit(1);
}

const raw = parsed.data;

const databaseUrl =
  raw.DATABASE_URL ??
  (raw.PGUSER && raw.PGPASSWORD && raw.PGHOST && raw.PGDATABASE
    ? `postgresql://${raw.PGUSER}:${encodeURIComponent(raw.PGPASSWORD)}@${raw.PGHOST}/${raw.PGDATABASE}?sslmode=require`
    : undefined);

export const env = Object.freeze({
  ...raw,
  isProduction: raw.NODE_ENV === "production",
  isDevelopment: raw.NODE_ENV === "development",
  rootDir,
  databaseUrl,
  corsOrigins: raw.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
});
