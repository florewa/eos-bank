declare module 'vue-yandex-metrika' {
  import { Plugin } from 'vue';

  export type YandexMetrika = (...args: any[]) => void;

  const VueYandexMetrika: Plugin;
  export default VueYandexMetrika;
}
