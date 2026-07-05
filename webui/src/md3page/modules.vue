<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SearchBar from '../components/md3/searchbar.vue';
import { moduleStore } from '../lib/stores/moduleStore';

const { t } = useI18n();

const searchQuery = ref('');

const filterModules = computed(() => {
  if (searchQuery.value.trim() === '') {
    return moduleStore.modules;
  }
  const query = searchQuery.value.toLowerCase();
  return moduleStore.modules.filter(
    (module) =>
      module.name.toLowerCase().includes(query) ||
      module.description.toLowerCase().includes(query) ||
      module.id.toLowerCase().includes(query),
  );
});

onMounted(async () => {
  await moduleStore.loadModules();

  moduleStore.modules.forEach((module) => {
    module.bottomopen = false;
  });
});

function handleSearch(value: string) {
  searchQuery.value = value;
}
</script>

<template>
  <div class="page">
    <div class="search-bar">
      <SearchBar @search="handleSearch" />
    </div>

    <div v-if="moduleStore.loading" class="center-content">
      {{ t('modules.scanning') }}
    </div>

    <div
      v-else-if="moduleStore.modules.length === 0 || filterModules.length === 0"
      class="center-content"
    >
     { t('modules.emptyState') }}
    </div>

    <div v-else>
      <var-card
        v-for="module in filterModules
          .slice()
          .sort(
            (a, b) =>
              (b.is_mounted === true ? 1 : 0) - (a.is_mounted === true ? 1 : 0),
          )"
        :key="module.id"
        :title="module.name"
        :subtitle="module.author+' '+ module.version"
        :description="module.description
              ? module.description
              : t('modules.noDescriptionLabel')"
        class="ex-card"
      >
      </var-card>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 12px;
}

.search-bar {
  margin-bottom: 12px;
}

.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.ex-card {
  margin-bottom: 12px;
}
</style>