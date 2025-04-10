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
    console.log(
      '[useInactivity] Установка таймера на',
      timeoutDuration / 1000,
      'секунд'
    );

    timeoutId = setTimeout(() => {
      if (modalRef.value && !isStandby.value) {
        console.log('[useInactivity] Открытие модального окна');
        modalRef.value.open();

        setTimeout(() => {
          if (modalRef.value && !isStandby.value) {
            console.log('[useInactivity] Вход в режим ожидания');
            isStandby.value = true;
            modalRef.value.close();
          } else {
            console.log(
              '[useInactivity] Не удалось войти в режим ожидания, isStandby уже true или modalRef недоступен'
            );
          }
        }, 60000);
      } else {
        console.log('[useInactivity] modalRef не определен');
      }
    }, timeoutDuration);
  };

  const activityEvents = ['touchstart', 'touchmove', 'touchend'];

  const handleActivity = () => {
    console.log('[useInactivity] Активность пользователя, сброс таймера');
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
      console.log('[useInactivity] Маршрут изменился, сброс таймера');
      resetTimer();
    }
  );

  return {};
}
