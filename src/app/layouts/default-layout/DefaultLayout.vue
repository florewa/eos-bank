<script setup lang="ts">
import { VKeyboard } from '@/shared/ui';
import { LoaderModal, TheFooter, TheHeader } from '@/widgets';
import { useGlobalStore } from '@/shared/store/globalStore.ts';
import { onMounted, ref, watch } from 'vue';

const globalStore = useGlobalStore();
const LoaderModalRef = ref<InstanceType<typeof LoaderModal> | null>(null);

watch(
  () => globalStore.isLoading,
  (newValue) => {
    if (LoaderModalRef.value) {
      if (newValue) {
        LoaderModalRef.value.open();
      } else {
        LoaderModalRef.value.close();
      }
    }
  }
);

onMounted(() => {
  globalStore.setIsLoading(true);
  setTimeout(() => {
    globalStore.setIsLoading(false);
  }, 5000000);
});
</script>

<template>
  <div class="main" ref="app">
    <TheHeader />
    <main class="page">
      <div class="container">
        <slot name="default" />
      </div>
    </main>
    <TheFooter />
    <VKeyboard />
    <LoaderModal ref="LoaderModalRef" />
  </div>
</template>

<style scoped lang="scss">
.main {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;

  .page {
    flex: 1 1 auto;
  }
}
</style>
