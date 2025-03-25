import { AppRoutes } from './types.ts';

export const routes = [
  {
    path: AppRoutes.HOME,
    name: 'home',
    component: () => import('@/pages/home-page'),
  },
  {
    path: AppRoutes.DEBT_INFO,
    name: 'debt-info',
    component: () => import('@/pages/debt-info'),
  },
  {
    path: AppRoutes.PAY_DEBT,
    name: 'pay-debt',
    component: () => import('@/pages/pay-debt'),
  },
  {
    path: AppRoutes.CABINET,
    name: 'cabinet',
    component: () => import('@/pages/cabinet-page'),
  },
];
