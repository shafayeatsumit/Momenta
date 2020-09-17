const calmTarget = (calibExhale, calibInhale) => {
  const maxCalibValue = Math.max(calibExhale, calibInhale);
  const value = 3.5;
  let result;
  if (maxCalibValue * 2 > value) {
    result = Math.min(maxCalibValue * 2, 5);
    return {targetInhale: result, targetExhale: result};
  } else {
    result = Math.min(value, 5);
    return {targetInhale: result, targetExhale: result};
  }
};

const relaxedTarget = (calibExhale, calibInhale) => {
  const maxCalibValue = Math.max(calibExhale, calibInhale);
  const value = 6;
  if (maxCalibValue * 2 > value) {
    return {targetInhale: value / 1.75, targetExhale: value};
  } else {
    return {
      targetInhale: (maxCalibValue * 2) / 1.75,
      targetExhale: maxCalibValue * 2,
    };
  }
};

const prepareForSleepTarget = (calibExhale, calibInhale) => {
  const maxCalibValue = Math.max(calibExhale, calibInhale);
  const value = 8;
  if (maxCalibValue * 3 > value) {
    return {targetInhale: value / 2.75, targetExhale: value};
  } else {
    return {
      targetInhale: (maxCalibValue * 3) / 2.75,
      targetExhale: maxCalibValue * 3,
    };
  }
};

export const setDynamicTarget = (exhale, inhale) => (dispatch, getState) => {
  const {guidedBreathing} = getState();
  let target;
  if (guidedBreathing.id === 'calm') {
    target = calmTarget(exhale, inhale);
  } else if (guidedBreathing.id === 'relaxed') {
    target = relaxedTarget(exhale, inhale);
  } else if (guidedBreathing.id === 'prepare_for_sleep') {
    target = prepareForSleepTarget(exhale, inhale);
  }
  dispatch({
    type: 'SET_DYNAMIC_TARGET',
    ...target,
  });
  return Promise.resolve();
};
