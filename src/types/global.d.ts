/// <reference types="vue/macros-global" />

export {};

declare global {
  interface Window {
    API: string;
    TIMEOUT: number;
    TIMEOUT_IN_PAYMENT: number;
    TERMINAL_ID: number;
    ym?: (...args: any[]) => void;
  }
}
