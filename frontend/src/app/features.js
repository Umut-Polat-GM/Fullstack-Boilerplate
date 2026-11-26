/**
 * Feature registry — every `src/features/<name>/index.js` is picked up
 * automatically at build time (Vite import.meta.glob). A feature exports:
 *
 *   export default {
 *     name: "products",
 *     routes: [{ path: "products", lazy: () => import("./pages/ProductsPage.jsx"), auth?: true }],
 *     nav:    [{ label: "Products", path: "/products", icon: Package }],
 *   };
 *
 * Generate a new full-stack module with: npm run generate <name>
 */
const modules = import.meta.glob("../features/*/index.js", { eager: true });

export const features = Object.values(modules)
  .map((mod) => mod.default)
  .filter(Boolean)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

export const featureRoutes = features.flatMap((f) => f.routes ?? []);
export const navItems = features.flatMap((f) => f.nav ?? []);
