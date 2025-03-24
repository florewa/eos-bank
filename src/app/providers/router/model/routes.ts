import { AppRoutes } from './types.ts';

export const routes = [
  {
    path: AppRoutes.HOME,
    name: 'home',
    component: () => import('@/pages/home-page'),
  },
  {
    path: AppRoutes.DEBT_INFO,
    name: 'about',
    component: () => import('@/pages/debt-info'),
  },
  {
    path: AppRoutes.PAY_DEBT,
    name: 'about',
    component: () => import('@/pages/pay-debt'),
  },
];
