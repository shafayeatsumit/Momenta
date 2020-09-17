export const calmTarget = (calibExhale, calibInhale) => {
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

export const relaxedTarget = (calibExhale, calibInhale) => {
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

export const prepareForSleepTarget = (calibExhale, calibInhale) => {
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
