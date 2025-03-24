<script setup lang="ts">
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { ref, onMounted, onUnmounted } from 'vue';
import 'swiper/css';
import 'swiper/css/navigation';

import img1 from '@/shared/assets/img/Agreement_Страница_1.png';
import img2 from '@/shared/assets/img/Agreement_Страница_1.png';
import img3 from '@/shared/assets/img/Agreement_Страница_1.png';
import { VButton } from '@/shared/ui';

let swiperInstance: Swiper | null = null;
const currentPage = ref(1);
const images = [img1, img2, img3];
const totalPages = images.length;

onMounted(() => {
  swiperInstance = new Swiper('.swiper', {
    modules: [Navigation],
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      slideChange: () => {
        if (swiperInstance) {
          currentPage.value = (swiperInstance.realIndex % totalPages) + 1;
        }
      },
    },
  });
});

onUnmounted(() => {
  if (swiperInstance) {
    swiperInstance.destroy();
  }
});
</script>

<template>
  <div class="agreements-slider">
    <div class="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(image, index) in images" :key="index">
          <img :src="image" :alt="`Страница ${index + 1}`" />
        </div>
      </div>
    </div>

    <div class="swiper-navigation">
      <VButton variant="outline" rounded class="swiper-button-prev">
        Предыдущая страница
      </VButton>
      <VButton variant="primary" rounded class="swiper-button-next">
        Следующая страница
      </VButton>
    </div>

    <div class="swiper-pagination">
      Страница {{ currentPage }} из {{ totalPages }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.agreements-slider {
  position: relative;
  width: 100%;
  max-width: 962px;
  margin: 0 auto;
}

.swiper {
  width: 100%;
  height: 1361px;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  width: 962px;
  height: 1361px;
  object-fit: cover;
}

.swiper-navigation {
  display: flex;
  justify-content: center;
  gap: 24px;
  position: relative;
  margin-top: 24px;
}

.swiper-button-prev,
.swiper-button-next {
  min-width: 300px;
  position: static;
  cursor: pointer;
}

.swiper-button-prev::after,
.swiper-button-next::after {
  display: none;
}

.swiper-pagination {
  text-align: center;
  margin-top: 16px;
}
</style>
