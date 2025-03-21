<script setup lang="ts">
import { VButton } from '@/shared/ui';
import IconInfo from '@/shared/ui/Icons/IconInfo.vue';
import IconQuestionBtn from '@/shared/ui/Icons/IconQuestionBtn.vue';
</script>

<template>
  <footer class="footer">
    <div class="footer__inner container">
      <div class="footer__body">
        <VButton variant="primary" big>
          <IconInfo />
          О компании
        </VButton>
        <VButton variant="primary" big>
          <IconQuestionBtn />
          Помощь
        </VButton>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  &__inner {
    width: 100%;
    margin-bottom: 40px;
  }

  &__body {
    flex: 1;
    width: 100%;
    display: flex;
    gap: 20px;
  }
}
</style>
