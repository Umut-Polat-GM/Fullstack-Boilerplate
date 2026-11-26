import { ApiError } from "#utils/ApiError.js";
import { created, ok } from "#utils/response.js";
import { ProductModel } from "./product.model.js";

/**
 * CONTROLLER — translates HTTP requests into model calls and model results
 * into HTTP responses. Input is already validated (req.validated).
 * Express 5 forwards thrown/rejected errors to the error middleware,
 * so no try/catch boilerplate is needed.
 */

export async function list(_req, res) {
  ok(res, await ProductModel.findAll());
}

export async function getById(req, res) {
  const product = await ProductModel.findById(req.validated.params.id);
  if (!product) throw ApiError.notFound("Product not found");
  ok(res, product);
}

export async function create(req, res) {
  created(res, await ProductModel.create(req.validated.body), "Product created");
}

export async function update(req, res) {
  const product = await ProductModel.update(req.validated.params.id, req.validated.body);
  if (!product) throw ApiError.notFound("Product not found");
  ok(res, product, "Product updated");
}

export async function remove(req, res) {
  const product = await ProductModel.remove(req.validated.params.id);
  if (!product) throw ApiError.notFound("Product not found");
  ok(res, product, "Product deleted");
}
