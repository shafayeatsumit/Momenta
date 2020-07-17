const getTodaysDate = () => {
  const today = new Date();
  const date =
    today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
  return date;
};

export const getTodaysFocus = () => (dispatch, getState) => {
  const breathing = getState();
  const tips = breathing.breathingTips;
  const focusOfTheDay = tips.find((tip) => tip.lastSeen === getTodaysDate());
  if (focusOfTheDay) {
    return focusOfTheDay;
  }
  const tipsSorted = tips.sort(
    (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime(),
  );
  const lastIndex = tipsSorted.length - 1;
  return tipsSorted[lastIndex];
};
