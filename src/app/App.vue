<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { DefaultLayout } from '@/app/layouts';
import { useSessionStore } from '@/shared/store/sessionStore.ts';
import { useAuthStore } from '@/features/AccountAuthorization/model';

const authStore = useAuthStore();

const route = useRoute();
const layout = computed(() => route.meta.layout || DefaultLayout);

onMounted(() => {
  authStore.clearAuthData();
  const session = useSessionStore();
  session.newSession();
});
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
