import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Match your backend port
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // use if backend doesn't want /api prefix
      },
    },
  },
});
