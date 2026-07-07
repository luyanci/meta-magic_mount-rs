<script setup lang="ts">
import { ref, onMounted, onUnmounted, onActivated, onDeactivated, watch } from 'vue';

const isActivePage = ref(true);
let observer: IntersectionObserver | null = null;

function setupObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  setTimeout(() => {
    const pageEl = document.querySelector('.md3-page');
    const rootEl = document.querySelector('.md3-layout__main');
    if (!pageEl || !rootEl) {
      isActivePage.value = true;
      return;
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        isActivePage.value = entry.isIntersecting && entry.intersectionRatio >= 0.6;
      },
      {
        root: rootEl,
        threshold: [0.6],
      },
    );

    observer.observe(pageEl);
  }, 100);
}

function cleanupObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

onMounted(() => {
  isActivePage.value = true;
  setupObserver();
});

onUnmounted(() => {
  cleanupObserver();
});

onActivated(() => {
  isActivePage.value = true;
  setupObserver();
});

onDeactivated(() => {
  cleanupObserver();
});
</script>

<template>
  <div class="bottom-actions-root" :class="{ 'is-active': isActivePage }">
    <slot />
  </div>
</template>

<style scoped>
.bottom-actions-root {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--bottom-nav-height, 64px) + var(--bottom-inset, 0px) + 16px);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  z-index: 90;
  opacity: 0;
  pointer-events: none;
  will-change: opacity, transform;
  transition: opacity 0.2s ease, transform 0.24s cubic-bezier(0.2, 1, 0.2, 1);
}

.bottom-actions-root.is-active {
  opacity: 1;
}

.bottom-actions-root > * {
  pointer-events: auto;
}

.bottom-actions-root > .spacer {
  flex: 1;
  pointer-events: none;
}
</style>
