import { onMounted, onUnmounted, watch } from 'vue';
import type { Ref } from 'vue';
import { useRoute } from 'vue-router';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

interface InactivityModal {
  open: () => void;
  close: () => void;
}

export function useInactivity(modalRef: Ref<InactivityModal | null>) {
  const route: RouteLocationNormalizedLoaded = useRoute();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const resetTimer = (): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const timeoutDuration: number =
      route.path === '/payment' ? window.TIMEOUT_IN_PAYMENT : window.TIMEOUT;

    timeoutId = setTimeout(() => {
      if (modalRef.value) {
        modalRef.value.open();
      }
    }, timeoutDuration);
  };

  const activityEvents: string[] = ['touchstart', 'touchmove', 'touchend'];

  const handleActivity = (): void => {
    resetTimer();
  };

  onMounted((): void => {
    activityEvents.forEach((event: string): void => {
      window.addEventListener(event, handleActivity);
    });
    resetTimer();
  });

  onUnmounted((): void => {
    activityEvents.forEach((event: string): void => {
      window.removeEventListener(event, handleActivity);
    });
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  watch(
    () => route.path,
    () => {
      resetTimer();
    }
  );

  return {};
}
