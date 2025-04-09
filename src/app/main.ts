import '@/app/assets/styles/main.scss';

import { VueQueryPlugin } from '@tanstack/vue-query';
import { vMaska } from 'maska/vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { router } from './providers';

import { queryClient } from '@/shared/api';

const app = createApp(App);

app
  .use(VueQueryPlugin, {
    enableDevtoolsV6Plugin: true,
    queryClient,
  })
  .use(router)
  .use(createPinia());

app.directive('maska', vMaska);

app.mount('#app');
