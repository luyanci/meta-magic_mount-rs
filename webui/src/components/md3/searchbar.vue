<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const searchQuery = ref('');

defineEmits<{
  (e: 'search', value: string): void;
}>();
</script>

<template>
    <var-input
      variant="outlined"
      v-model="searchQuery"
      :placeholder="t('modules.searchPlaceholder')"
      clearable
      @input="$emit('search', searchQuery)"
    >
      <template #prepend-icon>
        <var-icon name="magnify" />
      </template>
    </var-input>

</template>

<style scoped>
.search-bar {
  width: 100%;
}
</style>