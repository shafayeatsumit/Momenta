export const BREATHING_TYPES = [
  {
    id: 'calm',
    name: 'Calm',
    type: 'guided',
    targetInhale: 3.5,
    targetExhale: 3.5,
    firstThreshold: 120,
    secondThreshold: 0,
    secondTargetInhale: 0,
    secondTargetExhale: 0,
    breathingTime: 1,
  },
  {
    id: 'deep_calm',
    name: 'Deep Calm',
    type: 'guided',
    targetInhale: 5,
    targetExhale: 5,
    firstThreshold: 300,
    secondThreshold: 0,
    secondTargetInhale: 0,
    secondTargetExhale: 0,
    breathingTime: 1,
  },
  {
    id: 'prepare_for_sleep',
    name: 'Prepare For Sleep',
    type: 'guided',
    targetInhale: 3,
    targetExhale: 6,
    firstThreshold: 600,
    secondThreshold: 0,
    secondTargetInhale: 0,
    secondTargetExhale: 0,
    breathingTime: 5,
  },
  {
    id: 'inner_quiet',
    name: 'Inner Quiet',
    type: 'guided',
    targetInhale: 3,
    targetExhale: 6,
    firstThreshold: 30,
    secondThreshold: 120,
    secondTargetInhale: 3.5,
    secondTargetExhale: 3.5,
    breathingTime: 1,
  },
  {
    id: 'beginner_box',
    name: 'Beginner Box',
    type: 'fixed',
    inhale: 2,
    inhaleHold: 2,
    exhale: 2,
    exhaleHold: 2,
    breathingTime: 1,
  },
  {
    id: 'box',
    name: 'Box',
    type: 'fixed',
    inhale: 4,
    inhaleHold: 4,
    exhale: 4,
    exhaleHold: 4,
    breathingTime: 1,
  },
  {
    id: '4-7-8',
    name: '4/7/8/0',
    type: 'fixed',
    inhale: 4,
    inhaleHold: 7,
    exhale: 8,
    exhaleHold: 0,
    breathingTime: 1,
  },
  {
    id: 'custom',
    name: 'Custom',
    type: 'fixed',
    inhale: 3.5,
    inhaleHold: 3,
    exhale: 3,
    exhaleHold: 3,
    breathingTime: 1,
  },
];

export const BREATHING_TIME = {
  calm: {
    id: 'calm',
    min: 1,
    max: 15,
    interval: 1,
  },
  deep_calm: {
    id: 'deep_calm',
    min: 1,
    max: 10,
    interval: 1,
  },
  prepare_for_sleep: {
    id: 'prepare_for_sleep',
    min: 5,
    max: 30,
    interval: 1,
  },
  inner_quiet: {
    id: 'inner_quiet',
    min: 1,
    max: 5,
    interval: 1,
  },
  beginner_box: {
    id: 'beginner_box',
    min: 1,
    max: 30,
    interval: 1,
  },
  box: {
    id: 'box',
    min: 1,
    max: 30,
    interval: 1,
  },
  '4-7-8': {
    id: '4-7-8',
    min: 1,
    max: 30,
    interval: 1,
  },
  custom: {
    id: 'custom',
    min: 1,
    max: 30,
    interval: 1,
  },
};

export const CUSTOM_CONFIG = {
  custom_inhale: {
    id: 'custom_inhale',
    min: 1, //seconds
    max: 10, //seconds
    interval: 0.5, //seconds
  },
  custom_inhale_hold: {
    id: 'custom_inhale_hold',
    min: 1, //seconds
    max: 10, //seconds
    interval: 0.5, //seconds
  },
  custom_exhale: {
    id: 'custom_exhale',
    min: 1, //seconds
    max: 10, //seconds
    interval: 0.5, //seconds
  },
  custom_exhale_hold: {
    id: 'custom_exhale_hold',
    min: 1,
    max: 10,
    interval: 0.5,
  },
};
