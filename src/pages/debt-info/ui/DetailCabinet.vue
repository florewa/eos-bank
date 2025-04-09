<script setup lang="ts">
import { ref } from 'vue';

import { sendMetrikaGoal } from '@/shared/lib/metrika/sendMetrikaGoal.ts';
import { VButton } from '@/shared/ui';
import { CabinetModal } from '@/widgets/CabinetModal';

const cabinetModalRef = ref<InstanceType<typeof CabinetModal> | null>(null);

const moreAboutCabinet = () => {
  sendMetrikaGoal('more-about-cabinet');
  cabinetModalRef.value?.open();
};
</script>

<template>
  <section class="detail-cabinet">
    <div class="detail-cabinet__inner">
      <div class="detail-cabinet__title h1">
        Личный кабинет — простой способ узнать о долге
      </div>
      <div class="detail-cabinet__action">
        <VButton variant="outline" @click="moreAboutCabinet">
          Подробнее
        </VButton>
      </div>
    </div>
    <CabinetModal full-width ref="cabinetModalRef" />
  </section>
</template>

<style scoped lang="scss">
.detail-cabinet {
  &__inner {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
}
</style>
