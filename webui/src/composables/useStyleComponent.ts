import { computed, type ComputedRef, type Component } from 'vue';
import { uiStore } from '../lib/stores/uiStore';

export function useStyleComponent(components: {
  miuix: Component;
  md3: Component;
}): ComputedRef<Component> {
  return computed(() => {
    const style = uiStore.uiStyle;
    return components[style] || components.miuix;
  });
}