import path from "node:path";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "#config/env.js";
import { checkDatabase } from "#db/index.js";
import { arcjetProtect } from "#middlewares/arcjet.js";
import { errorHandler, notFound } from "#middlewares/error.js";
import { ok } from "#utils/response.js";

/** Builds the Express application. Kept separate from server.js so it can be tested. */
export function createApp(modules) {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1); // correct client IPs behind Render/Railway/Nginx

  // ── Global middleware ────────────────────────────────────────────
  app.use(
    helmet({
      // Allow product images from any https host in the bundled SPA
      contentSecurityPolicy: {
        directives: { "img-src": ["'self'", "data:", "https:"] },
      },
    }),
  );
  app.use(cors({ origin: env.isProduction ? env.corsOrigins : true, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(env.isProduction ? "combined" : "dev"));

  // ── API ──────────────────────────────────────────────────────────
  const api = express.Router();
  api.use(arcjetProtect);

  api.get("/health", async (_req, res) => {
    ok(res, {
      status: "ok",
      uptime: Math.round(process.uptime()),
      database: (await checkDatabase()) ? "connected" : "unavailable",
      modules: modules.map((m) => m.name),
    });
  });

  for (const mod of modules) {
    api.use(mod.basePath, mod.router);
  }

  api.use(notFound);
  app.use("/api", api);

  // ── SPA (production) ─────────────────────────────────────────────
  if (env.isProduction) {
    const distDir = path.join(env.rootDir, "frontend", "dist");
    app.use(express.static(distDir, { maxAge: "1y", index: false }));
    app.get("/{*splat}", (_req, res) => res.sendFile(path.join(distDir, "index.html")));
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
