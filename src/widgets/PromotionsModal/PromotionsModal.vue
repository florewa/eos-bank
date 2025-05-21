<script setup lang="ts">
import { ref } from 'vue';
import { type PropType } from 'vue';

import { VButton, VModal } from '@/shared/ui';
import type { UserStockItem } from '@/entities/user';

const isOpen = ref(false);

const props = defineProps({
  promotions: {
    type: Array as PropType<UserStockItem[]>,
    default: () => [],
  },
});

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

defineExpose({ open });
</script>

<template>
  <VModal :is-open="isOpen" @close="close">
    <div class="promotion-modal">
      <div class="promotion-modal__inner">
        <div class="promotion-modal__title">Доступные акции</div>
        <div class="promotion-modal__list">
          <div
            v-for="(promo, index) in props.promotions"
            :key="index"
            class="promotion-modal__list-item"
          >
            <div class="promotion-modal__column">
              <div class="promotion-modal__item-title">
                {{ promo.discount_type_name }}
              </div>
              <div class="promotion-modal__item-contract">
                По договору: <span>{{ promo.contract_number }}</span>
              </div>
              <div class="promotion-modal__item-text">
                Срок действия: {{ promo.start_discount_date }} -
                {{ promo.end_discount_date }}
              </div>
            </div>
            <div class="promotion-modal__column">
              <div class="promotion-modal__item-discount">
                Скидка {{ promo.discount }} или {{ promo.discount_prc }}
              </div>
            </div>
          </div>
        </div>
        <div class="promotion-modal__action">
          <VButton variant="primary" rounded @click="close">Закрыть</VButton>
        </div>
      </div>
    </div>
  </VModal>
</template>

<style scoped lang="scss">
.promotion-modal {
  &__inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    letter-spacing: 0.01em;
  }

  &__title {
    font-weight: 700;
    font-size: 40px;
    align-self: flex-start;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;

    &-item {
      min-width: 962px;
      text-align: left;
      background: var(--background-colors-light-green2);
      border-radius: 40px;
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__item-title {
    font-weight: 700;
  }

  &__item-contract {
    span {
      font-weight: 700;
      color: var(--red-accent);
    }
  }

  &__item-text {
    margin-top: 12px;
    color: var(--text-secondary);
  }

  &__item-discount {
    font-weight: 700;
    font-size: 28px;
    color: var(--red-accent);
  }

  &__action {
    align-self: flex-end;
  }
}
</style>
