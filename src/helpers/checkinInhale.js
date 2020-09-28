export const inhaleCalm = (exhaleTime) => Math.max(exhaleTime, 2);

export const inhaleRelaxed = (exhaleTime) => Math.max(exhaleTime / 1.75, 2);

export const inhalePrepForSleep = (exhaleTime) =>
  Math.max(exhaleTime / 2.75, 2);

export const inhaleInnterQuiet = (exhaleTime) => Math.max(exhaleTime / 2, 2);
