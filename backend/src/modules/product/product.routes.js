import { Router } from "express";
import { idParamSchema, validate } from "#middlewares/validate.js";
import * as controller from "./product.controller.js";
import { productBodySchema } from "./product.validation.js";

const router = Router();

router
  .route("/")
  .get(controller.list)
  .post(validate({ body: productBodySchema }), controller.create);

router
  .route("/:id")
  .get(validate({ params: idParamSchema }), controller.getById)
  .put(validate({ params: idParamSchema, body: productBodySchema }), controller.update)
  .delete(validate({ params: idParamSchema }), controller.remove);

export default router;
