import { AppRoutes } from './types.ts';

export const routes = [
  {
    path: AppRoutes.HOME,
    name: 'home',
    component: () => import('@/pages/home-page'),
  },
];
