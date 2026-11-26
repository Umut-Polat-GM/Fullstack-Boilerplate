import { createBrowserRouter } from "react-router";
import { MainLayout } from "@/components/layout/MainLayout";
import { RouteError } from "@/components/feedback/RouteError";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import { featureRoutes } from "./features";

/**
 * Feature routes use `lazy: () => import("./pages/X.jsx")` — the page module's
 * default export becomes the route Component (code-split per page).
 */
const toRoute = ({ auth: _auth, lazy, ...route }) => ({
  ...route,
  ...(lazy && { lazy: async () => ({ Component: (await lazy()).default }) }),
});

const publicRoutes = featureRoutes.filter((r) => !r.auth).map(toRoute);
const privateRoutes = featureRoutes.filter((r) => r.auth).map(toRoute);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    ErrorBoundary: RouteError,
    children: [
      { index: true, Component: HomePage },
      ...publicRoutes,
      { Component: ProtectedRoute, children: privateRoutes },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
