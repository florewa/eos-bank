<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { useGlobalStore } from '@/shared/store/globalStore.ts';
import { InactivityModal, VKeyboard } from '@/shared/ui';
import {
  ErrorModal,
  LoaderModal,
  SuccessPaymentModal,
  TheFooter,
  TheHeader,
} from '@/widgets';
import { useInactivity } from '@/shared/lib/hooks/useInactivity.ts';
import StandbyMode from '@/widgets/StandbyMode/StandbyMode.vue';

const globalStore = useGlobalStore();
const session = useSessionStore();
const LoaderModalRef = ref<InstanceType<typeof LoaderModal> | null>(null);
const SuccessModalRef = ref<InstanceType<typeof SuccessPaymentModal> | null>(
  null
);
const ErrorModalRef = ref<InstanceType<typeof ErrorModal> | null>(null);

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

watch(
  () => globalStore.isError,
  (newValue) => {
    if (ErrorModalRef.value) {
      if (newValue) {
        ErrorModalRef.value.open();
      } else {
        ErrorModalRef.value.close();
      }
    }
  }
);

const modalRef = ref(null);
const isStandby = ref(false);

const exitStandby = () => {
  if (isStandby.value) {
    console.log('[App] Выход из режима ожидания');
    isStandby.value = false;
    session.newSession();
  }
};

const qrImage = ref('');
const sbpUrl =
  'https://qr.nspk.ru/BD20001KFVL3DTB188K8MHAE2JQ5L627?type=02&bank=100000000004&sum=12300&cur=RUB&crc=82B1';

import QRCode from 'qrcode';
import { useSessionStore } from '@/shared/store/sessionStore.ts';

onMounted(() => {
  QRCode.toDataURL(sbpUrl, { width: 400 }, (err, url) => {
    if (!err) {
      qrImage.value = url;
    }
  });
});

onMounted(() => {
  window.addEventListener('touchstart', exitStandby);
});

onUnmounted(() => {
  window.removeEventListener('touchstart', exitStandby);
});

useInactivity(modalRef, isStandby);
</script>

<template>
  <!--  <div style="background-color: #faf5f7; border-radius: 30px; width: 400px">-->
  <!--    <img style="mix-blend-mode: multiply" :src="qrImage" alt="СБП QR-код" />-->
  <!--  </div>-->
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
    <ErrorModal ref="ErrorModalRef" />
    <Transition name="fade">
      <StandbyMode v-if="isStandby" />
    </Transition>
    <InactivityModal ref="modalRef" @update:standby="isStandby = $event" />
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
