<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { DefaultLayout } from '@/app/layouts';

const route = useRoute();

const layout = computed(() => route.meta.layout || DefaultLayout);
</script>

<template>
  <transition name="fade" mode="out-in">
    <component :is="layout">
      <template #default>
        <RouterView v-slot="{ Component }">
          <template v-if="Component">
            <transition name="fade" mode="out-in">
              <suspense>
                <component :is="Component" :key="route.fullPath"></component>
              </suspense>
            </transition>
          </template>
        </RouterView>
      </template>
    </component>
  </transition>
</template>

<style scoped></style>
