export {};

declare global {
  interface Window {
    API: string;
    ym: (id: string | number, method: string, ...args: any[]) => void;
  }
}
