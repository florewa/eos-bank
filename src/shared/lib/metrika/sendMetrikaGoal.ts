export const sendMetrikaGoal = (goal: string) => {
  if (typeof window !== 'undefined' && typeof window.ym === 'function') {
    window.ym(100902026, 'reachGoal', goal);
    console.log(`[metrika] goal sent: ${goal}`);
  } else {
    console.warn(`[metrika] ym is not available. Goal "${goal}" not sent.`);
  }
};
