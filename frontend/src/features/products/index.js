import { Package } from "lucide-react";

/** Feature manifest — auto-registered by src/app/features.js */
export default {
  name: "products",
  order: 1,
  routes: [{ path: "products", lazy: () => import("./pages/ProductsPage.jsx") }],
  nav: [{ label: "Products", path: "/products", icon: Package }],
};
