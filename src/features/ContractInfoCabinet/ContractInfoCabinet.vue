<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

import IconArrowLeft from '@/shared/assets/icons/IconArrowLeft.svg';
import { VButton } from '@/shared/ui';

import type { DebtInfo } from '@/entities/user/types.ts';
import type { UserStockItem } from '@/entities/user/types.ts';

defineProps<{
  contract: DebtInfo | null;
  promotions: UserStockItem[];
}>();

const emit = defineEmits(['back']);

const hidePaymentScreen = () => {
  emit('back');
};
</script>

<template>
  <section class="pay-debt">
    <div class="pay-debt__inner">
      <div class="pay-debt__header">
        <VButton variant="primary" class="pay-debt" @click="hidePaymentScreen">
          <IconArrowLeft />
          Назад
        </VButton>
        <h1 class="pay-debt__title">
          Договор №{{ contract?.contract_number }}
        </h1>
      </div>
      <div class="pay-debt__content">
        <div class="pay-debt__title h1">Информация о договоре</div>
        <div class="pay-debt__row">
          <div class="pay-debt__content-item">
            Номер договора: <b>{{ contract?.contract_number }}</b>
          </div>
          <div class="pay-debt__content-item">
            ID должника: <b>{{ contract?.ceid }}</b>
          </div>
          <div class="pay-debt__content-item">
            Сумма задолженности: <b>{{ contract?.debt_fnc_amount }}</b>
          </div>
        </div>
        <div class="pay-debt__row">
          <div class="pay-debt__content-item">
            Остаток задолженности: <span>{{ contract?.debt_fnc_balance }}</span>
          </div>
        </div>
        <!--        <div v-if="promotions.length" class="pay-debt__promotions">-->
        <!--          <div class="pay-debt__title h1">Доступные акции</div>-->
        <!--          <div-->
        <!--            v-for="promo in promotions"-->
        <!--            :key="promo.discount_jnl_id"-->
        <!--            class="pay-debt__promotion"-->
        <!--          >-->
        <!--            <div>-->
        <!--              <b>{{ promo.discount_name }}</b>-->
        <!--              <span v-if="promo.discount_prc">({{ promo.discount_prc }})</span>-->
        <!--            </div>-->
        <!--            <div>-->
        <!--              Скидка: <b>{{ promo.discount }}</b>-->
        <!--            </div>-->
        <!--            <div>-->
        <!--              Период:-->
        <!--              <b-->
        <!--                >{{ promo.start_discount_date }} —-->
        <!--                {{ promo.end_discount_date }}</b-->
        <!--              >-->
        <!--            </div>-->
        <!--            <div>-->
        <!--              Промокод: <b>{{ promo.promo }}</b>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pay-debt {
  &__inner {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  &__header {
    display: flex;
    gap: 20px;
    align-items: center;

    button {
      width: 164px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &-item {
      display: flex;
      gap: 12px;
      align-items: center;

      span {
        font-weight: 700;
        color: var(--red-accent);
      }
    }
  }

  &__row {
    display: flex;
    gap: 20px;
  }
}
</style>
