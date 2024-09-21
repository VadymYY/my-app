import path from "path";

import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
  },
  resolve: {
    alias: {
      api: path.resolve(__dirname, "./src/api"),
      components: path.resolve(__dirname, "./src/components"),
      config: path.resolve(__dirname, "./src/config"),
      connections: path.resolve(__dirname, "./src/connections"),
      constants: path.resolve(__dirname, "./src/constants"),
      enums: path.resolve(__dirname, "./src/enums"),
      lib: path.resolve(__dirname, "./src/lib"),
      assets: path.resolve(__dirname, "./src/assets"),
      pages: path.resolve(__dirname, "./src/pages"),
      router: path.resolve(__dirname, "./src/router"),
      types: path.resolve(__dirname, "./src/types"),
      utils: path.resolve(__dirname, "./src/utils"),
      schemas: path.resolve(__dirname, "./src/schemas"),
      store: path.resolve(__dirname, "./src/store"),
    },
  },
});
