import { onMounted, onUnmounted, watch } from 'vue';
import type { Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { useAuthStore } from '@/features/AccountAuthorization/model';
import { useSessionStore } from '@/shared/store/sessionStore.ts';

interface InactivityModal {
  open: () => void;
  close: () => void;
}

export function useInactivity(
  modalRef: Ref<InactivityModal | null>,
  isStandby: Ref<boolean>
) {
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const resetTimer = () => {
    if (timeoutId) clearTimeout(timeoutId);

    const timeoutDuration =
      route.path === '/payment' ? window.TIMEOUT_IN_PAYMENT : window.TIMEOUT;

    timeoutId = setTimeout(() => {
      if (modalRef.value && !isStandby.value) {
        modalRef.value.open();

        const session = useSessionStore();

        setTimeout(() => {
          if (modalRef.value && !isStandby.value) {
            authStore.clearAuthData();
            void router.push('/');
            session.newSession();
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
