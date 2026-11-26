import { aj } from "#lib/arcjet.js";
import { ApiError } from "#utils/ApiError.js";

/** Applies Arcjet rules (shield, bot detection, rate limit) to every request. */
export async function arcjetProtect(req, _res, next) {
  if (!aj) return next(); // Arcjet disabled (no ARCJET_KEY)

  const decision = await aj.protect(req, { requested: 1 }); // each request costs 1 token

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) throw ApiError.tooManyRequests();
    if (decision.reason.isBot()) throw ApiError.forbidden("Bot access denied");
    throw ApiError.forbidden();
  }

  const spoofedBot = decision.results.some(
    (result) => result.reason.isBot() && result.reason.isSpoofed(),
  );
  if (spoofedBot) throw ApiError.forbidden("Spoofed bot detected");

  next();
}
