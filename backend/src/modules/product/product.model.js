import { sql } from "#db/index.js";

/**
 * MODEL — the only layer that talks to the database.
 * Controllers never write SQL; they call these functions.
 */

export const ProductModel = {
  /**
   * Idempotent schema setup, called once at startup. Keep every statement
   * safe to re-run (IF NOT EXISTS) so existing databases are upgraded in place.
   */
  async migrate() {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(255)   NOT NULL,
        image       TEXT           NOT NULL,
        price       DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
        created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
      )
    `;
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`;
  },

  findAll() {
    return sql`SELECT * FROM products ORDER BY created_at DESC`;
  },

  async findById(id) {
    const [product] = await sql`SELECT * FROM products WHERE id = ${id}`;
    return product ?? null;
  },

  async create({ name, image, price }) {
    const [product] = await sql`
      INSERT INTO products (name, image, price)
      VALUES (${name}, ${image}, ${price})
      RETURNING *
    `;
    return product;
  },

  async update(id, { name, image, price }) {
    const [product] = await sql`
      UPDATE products
      SET name = ${name}, image = ${image}, price = ${price}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return product ?? null;
  },

  async remove(id) {
    const [product] = await sql`DELETE FROM products WHERE id = ${id} RETURNING *`;
    return product ?? null;
  },
};
