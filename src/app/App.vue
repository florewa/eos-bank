<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { DefaultLayout } from '@/app/layouts';
import { InactivityModal } from '@/shared/ui';
import { useInactivity } from '@/shared/lib/hooks/useInactivity.ts';

const route = useRoute();
const layout = computed(() => route.meta.layout || DefaultLayout);
const modalRef = ref(null);

useInactivity(modalRef);
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
  <InactivityModal ref="modalRef" />
</template>

<style scoped></style>
