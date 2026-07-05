/*
 * Copyright (C) 2026 meta-magic_mount-rs developers
 * SPDX-License-Identifier: GPL-v3
 */

import { createApp } from "vue";
import Vconsole from 'vconsole'
import Varlet from '@varlet/ui'
import i18n, { initI18n } from "./locales";
import "./style.css";
import 'miuix-vue/style.css'
import '@varlet/ui/es/style'
import App from "./App.vue";
import { uiStore } from "./lib/stores/uiStore";

const app = createApp(App);
app.use(i18n);
new Vconsole() // unless need to debug,dont uncomment it
const init = async () => {
  await uiStore.init();
  const savedLocale = localStorage.getItem("locale");
  await initI18n(savedLocale ?? undefined);
  if (uiStore.uiStyle === 'miuix') {
    // await import('miuix-vue/style.css');
    app.mount("#app");
  } else {
    // await import('@varlet/ui/es/style')
    app.use(Varlet)
    app.mount("#app")
  }
};

init();
