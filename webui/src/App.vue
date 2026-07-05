<script setup lang="ts">
import { ref, computed,onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { uiStore } from "./lib/stores/uiStore";
import MiuixLayout from "./layouts/MiuixLayout.vue";
import Md3Layout from "./layouts/Md3Layout.vue";
import status from "./page/status.vue";
import config from "./page/config.vue";
import modules from "./page/modules.vue";
import about from "./page/about.vue";

const { t } = useI18n();

const pages = [status, config, modules, about];
const titles = [
  t("tabs.status"),
  t("tabs.config"),
  t("tabs.modules"),
  t("tabs.info"),
];

const navindex = ref(0);
const activepage = computed(() => pages[navindex.value]);

const CurrentLayout = computed(() => {
  return uiStore.uiStyle === "md3" ? Md3Layout : MiuixLayout;
});

const appStyleClass = computed(() => `app--style-${uiStore.uiStyle}`);

onMounted(async () => {
  await uiStore.init();
});

</script>

<template>
  <div :class="appStyleClass">
    <component
      :is="CurrentLayout"
      v-model:navindex="navindex"
      :activepage="activepage"
      :titles="titles"
    />
  </div>
</template>

<style scoped>
.app--style-md3 {
  --m-color-surface: var(--m-color-surface);
}
</style>
