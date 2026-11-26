import { env } from "#config/env.js";
import { isDatabaseConfigured } from "#db/index.js";
import { aj, arcjetMode } from "#lib/arcjet.js";
import { logger } from "#lib/logger.js";
import { createApp } from "./app.js";
import { loadModules } from "./modules/index.js";

async function runMigrations(modules) {
  if (!isDatabaseConfigured) {
    logger.warn(
      "No database configured — skipping migrations (API will return errors for DB routes).",
    );
    return;
  }
  for (const mod of modules) {
    if (typeof mod.migrate !== "function") continue;
    try {
      await mod.migrate();
      logger.success(`Migrated module "${mod.name}"`);
    } catch (error) {
      logger.error(`Migration failed for module "${mod.name}":`, error.message);
    }
  }
}

async function bootstrap() {
  const modules = await loadModules();
  await runMigrations(modules);

  const app = createApp(modules);
  const server = app.listen(env.PORT, () => {
    logger.success(`API running on http://localhost:${env.PORT}/api (${env.NODE_ENV})`);
    logger.info(
      `Modules: ${modules.map((m) => `${m.name} → /api${m.basePath}`).join(", ") || "none"}`,
    );
    logger.info(`Arcjet: ${aj ? arcjetMode : "disabled (no ARCJET_KEY)"}`);
  });

  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down…`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});
