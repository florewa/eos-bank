import { onMounted, onUnmounted, watch } from 'vue';
import type { Ref } from 'vue';
import { useRoute } from 'vue-router';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

interface InactivityModal {
  open: () => void;
  close: () => void;
}

export function useInactivity(
  modalRef: Ref<InactivityModal | null>,
  isStandby: Ref<boolean>
) {
  const route = useRoute();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const resetTimer = () => {
    if (timeoutId) clearTimeout(timeoutId);

    const timeoutDuration =
      route.path === '/payment' ? window.TIMEOUT_IN_PAYMENT : window.TIMEOUT;

    timeoutId = setTimeout(() => {
      if (modalRef.value && !isStandby.value) {
        modalRef.value.open();

        setTimeout(() => {
          if (modalRef.value && !isStandby.value) {
            isStandby.value = true;
            modalRef.value.close();
          } else {
          }
        }, 60000);
      } else {
      }
    }, timeoutDuration);
  };

  const activityEvents = ['touchstart', 'touchmove', 'touchend'];

  const handleActivity = () => {
    resetTimer();
  };

  onMounted(() => {
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });
    resetTimer();
  });

  onUnmounted(() => {
    activityEvents.forEach((event) => {
      window.removeEventListener(event, handleActivity);
    });
    if (timeoutId) clearTimeout(timeoutId);
  });

  watch(
    () => route.path,
    () => {
      resetTimer();
    }
  );

  return {};
}
