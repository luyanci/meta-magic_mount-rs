<script setup lang="ts">

import '@varlet/ui/es/style'
import { ref, watch, onMounted, onBeforeUnmount, type Component } from "vue";
import { useI18n } from "vue-i18n";
import { StyleProvider, Themes,Dialog } from "@varlet/ui";
import { API } from "../lib/api";

const { t } = useI18n();
const icons = ["home", "cog", "menu", "information"];

const isDark = ref(false);
let mediaQuery: MediaQueryList | null = null;

function applyTheme() {
  StyleProvider(isDark.value ? Themes.md3Dark : Themes.md3Light);
}

function handleThemeChange(e: MediaQueryListEvent) {
  isDark.value = e.matches;
}

onMounted(() => {
  mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  isDark.value = mediaQuery.matches;
  applyTheme();
  mediaQuery.addEventListener("change", handleThemeChange);
});

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener("change", handleThemeChange);
});

watch(isDark, () => {
  applyTheme();
});

const props = defineProps<{
  navindex: number;
  activepage: Component;
  titles: string[];
}>();

const emit = defineEmits<{
  (e: "update:navindex", value: number): void;
}>();

const localNavindex = ref(props.navindex);

watch(() => props.navindex, (val) => {
  localNavindex.value = val;
});

function handleChange(value?) {
  emit("update:navindex", value);
  return
}

function reboot_request() {
  Dialog({
    title: t("common.rebootTitle"),
    message: t("common.rebootConfirm"),
    confirmButtonText: t("common.reboot"),
    cancelButtonText: t("common.cancel"),
    onConfirm: () => {
      API.reboot()
    },
  })
}
</script>

<template>
  <div class="md3-layout">
    <var-app-bar :title="t('common.appName')">
        <template #right>
            <var-button round text>
                <var-icon name="power" @click="reboot_request"/>
            </var-button>
        </template>
    </var-app-bar>

    <main class="md3-layout__main">
      <Transition name="page" mode="out-in">
        <KeepAlive>
          <component :is="activepage" :key="navindex" v-if="activepage" />
        </KeepAlive>
      </Transition>
    </main>

    <var-bottom-navigation variant class="md3-layout__nav" v-model:active="localNavindex" @change="handleChange">
      <var-bottom-navigation-item
        v-for="(title, index) in titles"
        :key="index"
        :label="title"
        :icon="icons[index]"
      />
    </var-bottom-navigation>
  </div>
</template>

<style>
body {
  transition: background-color .25s, color .25s;
  color: var(--color-text);
  background-color: var(--color-body);
  color-scheme: var(--color-scheme);
}

.md3-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-surface);
}

.md3-layout__main {
  flex: 1;
  overflow-y: auto;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
