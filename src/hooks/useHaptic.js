export const haptic = (duration = 10) => {
  if (navigator.vibrate) navigator.vibrate(duration);
};
