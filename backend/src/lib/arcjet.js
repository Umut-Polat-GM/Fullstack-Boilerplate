import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";
import { env } from "#config/env.js";

/**
 * Arcjet instance, or `null` when ARCJET_KEY is not set (protection disabled).
 * Rules: Shield (SQLi/XSS…), bot detection and a token-bucket rate limit per IP.
 *
 * Mode: "LIVE" blocks requests, "DRY_RUN" only logs decisions. Defaults to LIVE
 * in production and DRY_RUN in development so curl/Postman keep working.
 */
export const arcjetMode = env.ARCJET_MODE ?? (env.isProduction ? "LIVE" : "DRY_RUN");

export const aj = env.ARCJET_KEY
  ? arcjet({
      key: env.ARCJET_KEY,
      characteristics: ["ip.src"],
      rules: [
        shield({ mode: arcjetMode }),
        detectBot({
          mode: arcjetMode,
          // Block all bots except search engines — https://arcjet.com/bot-list
          allow: ["CATEGORY:SEARCH_ENGINE"],
        }),
        tokenBucket({
          mode: arcjetMode,
          refillRate: 30,
          interval: 5,
          capacity: 20,
        }),
      ],
    })
  : null;
