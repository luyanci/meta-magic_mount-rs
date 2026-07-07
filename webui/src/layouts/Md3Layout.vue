<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, type Component } from 'vue';
import { useI18n } from 'vue-i18n';
import { API } from '../lib/api';
import { ICONS } from '../lib/constants';
import '../md3-theme.css';

const { t } = useI18n();

const isDark = ref(false);
let mediaQuery: MediaQueryList | null = null;

function applyTheme() {
  document.documentElement.classList.toggle('dark', isDark.value);
}

function handleThemeChange(e: MediaQueryListEvent) {
  isDark.value = e.matches;
}

onMounted(() => {
  document.documentElement.classList.add('md3-active');
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  isDark.value = mediaQuery.matches;
  applyTheme();
  mediaQuery.addEventListener('change', handleThemeChange);
});

onBeforeUnmount(() => {
  document.documentElement.classList.remove('md3-active');
  mediaQuery?.removeEventListener('change', handleThemeChange);
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
  (e: 'update:navindex', value: number): void;
}>();

const localNavindex = ref(props.navindex);
const showRebootConfirm = ref(false);

watch(() => props.navindex, (val) => {
  localNavindex.value = val;
});

function handleNavChange(index: number) {
  localNavindex.value = index;
  emit('update:navindex', index);
}

function reboot() {
  showRebootConfirm.value = false;
  void API.reboot();
}

const navIcons = ['home', 'settings', 'modules', 'info'];
</script>

<template>
  <div class="md3-layout">
    <header class="md3-layout__header">
      <div class="header-content">
        <span class="header-title">{{ t('common.appName') }}</span>
      </div>
      <button class="header-action-btn" @click="showRebootConfirm = true">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path :d="ICONS.power" />
        </svg>
      </button>
    </header>

    <main class="md3-layout__main">
      <Transition name="page" mode="out-in">
        <component :is="activepage" :key="navindex" v-if="activepage" />
      </Transition>
    </main>

    <nav class="md3-layout__nav">
      <button
        v-for="(title, index) in titles"
        :key="index"
        class="nav-item"
        :class="{ active: localNavindex === index }"
        @click="handleNavChange(index)"
      >
        <svg
          class="nav-icon"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path :d="ICONS[navIcons[index] as keyof typeof ICONS]" />
        </svg>
        <span class="nav-label">{{ title }}</span>
      </button>
    </nav>

    <div v-if="showRebootConfirm" class="dialog-overlay" @click.self="showRebootConfirm = false">
      <div class="dialog-content">
        <div class="dialog-headline">{{ t('common.rebootTitle') }}</div>
        <div class="dialog-body">{{ t('common.rebootConfirm') }}</div>
        <div class="dialog-actions">
          <button class="dialog-btn-text" @click="showRebootConfirm = false">
            {{ t('common.cancel') }}
          </button>
          <button class="dialog-btn-text" @click="reboot">
            {{ t('common.reboot') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.md3-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--md-sys-color-background);
}

.md3-layout__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--md-sys-color-surface);
  border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.header-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
}

.header-action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: var(--md-sys-color-on-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.header-action-btn svg {
  fill: currentColor;
}

.header-action-btn:hover {
  background-color: var(--md-sys-color-surface-container-highest);
}

.md3-layout__main {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: calc(16px + var(--bottom-nav-height, 64px) + var(--bottom-inset, 0px));
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.md3-layout__nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  background-color: var(--md-sys-color-surface);
  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 12px;
}

.nav-item:hover {
  background-color: var(--md-sys-color-surface-container);
}

.nav-item.active {
  color: var(--md-sys-color-primary);
}

.nav-item:not(.active) {
  color: var(--md-sys-color-on-surface-variant);
}

.nav-icon {
  fill: currentColor;
  transition: transform 0.2s;
}

.nav-item.active .nav-icon {
  transform: scale(1.1);
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.dialog-content {
  background-color: var(--md-sys-color-surface-container-highest);
  border-radius: 28px;
  padding: 24px;
  width: 90%;
  max-width: 320px;
}

.dialog-headline {
  font-size: 20px;
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
  margin-bottom: 16px;
}

.dialog-body {
  font-size: 14px;
  color: var(--md-sys-color-on-surface-variant);
  margin-bottom: 24px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.dialog-btn-text {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--md-sys-color-primary);
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.dialog-btn-text:hover {
  background-color: rgba(103, 80, 164, 0.1);
}
</style>