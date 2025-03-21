<script setup lang="ts">
import { ref } from 'vue';
import { VButton, VInput } from '@/shared/ui';
import IconHuman from '@/shared/ui/Icons/IconHuman.vue';
import IconChecklist from '@/shared/ui/Icons/IconChecklist.vue';
import IconDocument from '@/shared/ui/Icons/IconDocument.vue';

const username = ref<string>('');
</script>

<template>
  <section class="main">
    <div class="main__inner container">
      <div class="main__body">
        <div class="main__list">
          <VButton variant="primary" big>
            <IconHuman />
            Узнать о задолженности
          </VButton>
          <VButton variant="primary" big>
            <img src="/img/Icons/IconDocument.svg" alt="" />
            Оплатить задолженность
          </VButton>
          <VButton variant="primary" big> Получить кредит в банке</VButton>
          <VButton variant="primary" big>Получить деньги на карту</VButton>
          <VButton variant="primary" big>Оформить ОСАГО</VButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.main {
  &__inner {
    max-width: 660px;

    button {
      min-width: 660px;
    }
  }

  &__body {
    margin-block: 256px 344px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
}
</style>
