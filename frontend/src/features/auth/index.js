/** Feature manifest — auto-registered by src/app/features.js */
export default {
  name: "auth",
  order: 90,
  routes: [
    { path: "login", lazy: () => import("./pages/LoginPage.jsx") },
    { path: "profile", lazy: () => import("./pages/ProfilePage.jsx"), auth: true },
  ],
  nav: [],
};
