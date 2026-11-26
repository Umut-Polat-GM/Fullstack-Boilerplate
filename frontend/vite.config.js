import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// The root `.env` is shared with the backend; only VITE_* vars reach the browser.
const envDir = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, "");
  const apiPort = env.PORT || 3000;

  return {
    envDir,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    build: {
      // Split big, rarely-changing libraries into long-term cacheable chunks.
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: "react",
                test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
                priority: 30,
              },
              {
                name: "mui",
                test: /node_modules[\\/](@mui|@emotion|@popperjs)[\\/]/,
                priority: 20,
              },
              {
                name: "motion",
                test: /node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/,
                priority: 20,
              },
              {
                name: "lottie",
                test: /node_modules[\\/](lottie-web|lottie-react)[\\/]/,
                priority: 20,
              },
              { name: "vendor", test: /node_modules/, priority: 10 },
            ],
          },
        },
      },
    },
    server: {
      port: 5173,
      // Same-origin /api in dev → no CORS issues, identical URLs to production.
      proxy: {
        "/api": { target: `http://localhost:${apiPort}`, changeOrigin: true },
      },
    },
  };
});
