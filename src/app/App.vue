<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { DefaultLayout } from '@/app/layouts';
import { useInactivity } from '@/shared/lib/hooks/useInactivity.ts';
import { InactivityModal } from '@/shared/ui';
import StandbyMode from '@/widgets/StandbyMode/StandbyMode.vue';

const route = useRoute();
const layout = computed(() => route.meta.layout || DefaultLayout);
const modalRef = ref(null);
const isStandby = ref(false);

const exitStandby = () => {
  if (isStandby.value) {
    console.log('[App] Выход из режима ожидания');
    isStandby.value = false;
  }
};

onMounted(() => {
  window.addEventListener('touchstart', exitStandby);
});

onUnmounted(() => {
  window.removeEventListener('touchstart', exitStandby);
});

useInactivity(modalRef, isStandby);
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
  <InactivityModal ref="modalRef" @update:standby="isStandby = $event" />
  <Transition name="fade">
    <div v-if="isStandby">
      <StandbyMode />
    </div>
  </Transition>
</template>
