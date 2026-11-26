import { ProductModel } from "./product.model.js";
import router from "./product.routes.js";

/**
 * Module manifest — auto-discovered by src/modules/index.js.
 * Every folder in src/modules with an index.js like this is mounted
 * at /api/<basePath> and its `migrate` runs once at startup.
 */
export default {
  name: "product",
  basePath: "/products",
  router,
  migrate: ProductModel.migrate,
};
