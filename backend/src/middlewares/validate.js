import { z } from "zod";
import { ApiError } from "#utils/ApiError.js";

/**
 * Validates (and coerces) request parts with Zod schemas.
 * Parsed values are stored on `req.validated` so controllers get clean data.
 *
 *   router.post("/", validate({ body: createProductSchema }), controller.create);
 */
export const validate =
  (schemas = {}) =>
  (req, _res, next) => {
    req.validated = {};

    for (const part of ["params", "query", "body"]) {
      const schema = schemas[part];
      if (!schema) continue;

      const result = schema.safeParse(req[part] ?? {});
      if (!result.success) {
        throw ApiError.badRequest("Validation failed", z.flattenError(result.error).fieldErrors);
      }
      req.validated[part] = result.data;
    }

    next();
  };

// Reusable schemas
export const idParamSchema = z.object({
  id: z.coerce
    .number({ error: "ID must be a positive integer" })
    .int("ID must be a positive integer")
    .positive("ID must be a positive integer"),
});
