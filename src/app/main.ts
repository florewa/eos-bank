import '@/app/assets/styles/main.scss';

import { VueQueryPlugin } from '@tanstack/vue-query';
import { vMaska } from 'maska/vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import VueYandexMetrika from 'vue-yandex-metrika';

import App from './App.vue';
import { router } from './providers';

import { queryClient } from '@/shared/api';

const app = createApp(App);

// Подключение плагинов
app
  .use(VueQueryPlugin, {
    enableDevtoolsV6Plugin: true,
    queryClient,
  })
  .use(router)
  .use(createPinia())
  .use(VueYandexMetrika, {
    id: '100902026', // Замените на ваш номер счетчика
    router, // Ваш роутер
    env: process.env.NODE_ENV, // Среда выполнения
    options: {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    },
    debug: true, // Логи для отладки
  });

app.directive('maska', vMaska);

app.mount('#app');
