import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import stylex from "@stylexjs/unplugin";

const pages = process.env.PAGES === "1";
const pagesRoot = (process.env.PAGES_BASE || "/").replace(/\/?$/, "/");
const base = pages ? `${pagesRoot}astra/` : "/";

export default defineConfig({
  base,
  server: { port: 3001, strictPort: true, host: "0.0.0.0" },
  plugins: [
    tanstackStart(
      pages
        ? {
            spa: { enabled: true },
            router: { basepath: base.replace(/\/$/, "") || "/" },
          }
        : {},
    ),
    stylex.vite({ useCSSLayers: { before: ["reset", "base"] } }),
    react(),
  ],
});
