import '@/app/assets/styles/main.scss';

import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import { queryClient } from '@/shared/api';

import App from './App.vue';
import { router } from './providers';

const app = createApp(App);

app
  .use(VueQueryPlugin, {
    enableDevtoolsV6Plugin: true,
    queryClient,
  })
  .use(router)
  .use(createPinia());

app.mount('#app');
