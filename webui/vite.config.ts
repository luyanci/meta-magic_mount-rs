/*
 * Copyright (C) 2026 meta-magic_mount-rs developers
 * SPDX-License-Identifier: GPL-v3
 */

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import components from "unplugin-vue-components/vite";
import autoImport from "unplugin-auto-import/vite";
import { VarletImportResolver } from "@varlet/import-resolver";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: "../module/webroot",
    target: "esnext",
  },
  plugins: [
    vue(),
    components({
      resolvers: [VarletImportResolver()],
    }),
    autoImport({
      resolvers: [VarletImportResolver({autoImport: true})],
    }),

  ],
});
