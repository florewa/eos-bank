// metrikaUtils.ts

// Генерация уникального UserID
export const generateUserID = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Установка нового UserID в Метрику
export const setMetrikaUserID = (userID: string) => {
  if (typeof window !== 'undefined' && typeof window.ym === 'function') {
    window.ym(100902026, 'setUserID', userID);
    console.log(`[metrika] UserID set: ${userID}`);
  } else {
    console.warn('[metrika] ym is not available. UserID not set.');
  }
};

// Сброс сессии и установка нового пользователя
export const resetMetrikaSession = (): string => {
  const newUserID = generateUserID();
  setMetrikaUserID(newUserID);
  return newUserID; // Возвращаем новый UserID для дальнейшего использования
};

// Существующая функция отправки цели
export const sendMetrikaGoal = (goal: string) => {
  if (typeof window !== 'undefined' && typeof window.ym === 'function') {
    window.ym(100902026, 'reachGoal', goal);
    console.log(`[metrika] goal sent: ${goal}`);
  } else {
    console.warn(`[metrika] ym is not available. Goal "${goal}" not sent.`);
  }
};
