import { z } from "zod";

// "" / null must not silently coerce to 0
const requiredNumber = (message) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number({ error: message }),
  );

export const productBodySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  image: z.url("Image must be a valid URL"),
  price: requiredNumber("Price must be a valid number").pipe(
    z.number().nonnegative("Price must be 0 or greater"),
  ),
});
