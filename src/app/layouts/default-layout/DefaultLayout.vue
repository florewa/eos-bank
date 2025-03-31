<script setup lang="ts">
import { VKeyboard } from '@/shared/ui';
import {
  LoaderModal,
  SuccessPaymentModal,
  TheFooter,
  TheHeader,
} from '@/widgets';
import { useGlobalStore } from '@/shared/store/globalStore.ts';
import { onMounted, ref, watch } from 'vue';

const globalStore = useGlobalStore();
const LoaderModalRef = ref<InstanceType<typeof LoaderModal> | null>(null);
const SuccessModalRef = ref<InstanceType<typeof SuccessPaymentModal> | null>(
  null
);

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

watch(
  () => globalStore.isSuccess,
  (newValue) => {
    if (SuccessModalRef.value) {
      if (newValue) {
        SuccessModalRef.value.open();
      } else {
        SuccessModalRef.value.close();
      }
    }
  }
);

onMounted(() => {
  globalStore.setIsLoading(true);
  globalStore.setIsSuccess(false);

  setTimeout(() => {
    globalStore.setIsLoading(false);
  }, 1500);

  setTimeout(() => {
    globalStore.setIsSuccess(true);
  }, 2000);
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
    <SuccessPaymentModal ref="SuccessModalRef" />
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
