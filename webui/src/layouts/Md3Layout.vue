<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, type Component } from "vue";
import { useI18n } from "vue-i18n";
import { StyleProvider, Themes } from "@varlet/ui";

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
</script>

<template>
  <div class="md3-layout">
    <var-app-bar :title="t('common.appName')">
        <!-- todo:add button -->
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

<style scoped>
.md3-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--m-color-surface);
}

.md3-layout__header {
  padding: 16px;
  padding-top: calc(16px + var(--top-inset));
  border-bottom: 1px solid var(--m-color-outline-variant);
}

.md3-layout__header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: var(--m-color-on-surface);
}

.md3-layout__main {
  flex: 1;
  overflow-y: auto;
}

.md3-layout__nav {
  display: flex;
  justify-content: space-around;
  padding: 8px;
  padding-bottom: calc(8px + var(--bottom-inset));
  border-top: 1px solid var(--m-color-outline-variant);
  background: var(--m-color-surface-container);
}

.md3-layout__nav button {
  flex: 1;
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 20px;
  color: var(--m-color-on-surface-variant);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.md3-layout__nav button.active {
  background: var(--m-color-secondary-container);
  color: var(--m-color-on-secondary-container);
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
