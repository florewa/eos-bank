import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/home/index.vue'; // Импортируем страницу Home

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/about/index.vue'), // Ленивая загрузка
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Используем HTML5 History API
  routes,
});

export default router;
