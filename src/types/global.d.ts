/// <reference types="vue/macros-global" />
import type { YandexMetrika } from 'vue-yandex-metrika';

export {};

declare global {
  interface Window {
    API: string;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $metrika: YandexMetrika;
  }
}
