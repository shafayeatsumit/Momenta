const calmTarget = (calibExhale) => {
  const targetExhale = Math.min(2 * calibExhale, 5);
  const targetInhale = targetExhale;
  return {targetInhale, targetExhale};
};

const prepareForSleepTarget = (calibExhale) => {
  const targetExhale = Math.min(calibExhale * 3, 8);
  const targetInhale = targetExhale / 2.75;

  return {
    targetInhale,
    targetExhale,
  };
};

export const setDynamicTarget = (exhale, inhale) => (dispatch, getState) => {
  const {guidedBreathing} = getState();
  let target;
  if (guidedBreathing.id === 'calm') {
    target = calmTarget(exhale);
  } else if (guidedBreathing.id === 'prepare_for_sleep') {
    target = prepareForSleepTarget(exhale);
  }
  dispatch({
    type: 'SET_DYNAMIC_TARGET',
    ...target,
  });
  return Promise.resolve();
};
