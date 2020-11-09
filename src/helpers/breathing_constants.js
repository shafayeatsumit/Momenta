export const BREATHING_TYPES = [
  {
    id: 'calm',
    name: 'Calm',
    type: 'guided',
    dynamicTarget: true,
    targetInhale: 0,
    targetExhale: 0,
    firstThreshold: 60 * 1000,
    breathingTime: 5,
    image: require('../../assets/images/calm.jpg'),
    background: require('../../assets/images/calm_home.jpg'),
    name_line_one: null,
    name_line_two: 'Calm',
    description:
      'Adaptive exercise that rebalances your breathing patterns to bring you into natural calmness and clarity.',
  },
  {
    id: 'prepare_for_sleep',
    name: 'Prepare For Sleep',
    type: 'guided',
    dynamicTarget: true,
    targetInhale: 0,
    targetExhale: 0,
    firstThreshold: 240 * 1000,
    breathingTime: 5,
    image: require('../../assets/images/prepare_for_sleep.jpg'),
    background: require('../../assets/images/prepare_for_sleep_home.jpg'),
    name_line_one: 'Prepare for',
    name_line_two: 'Sleep',
    description:
      'Adaptive exercise that shifts breathing to longer, slower exhaling, which mimics how we breathe as we sleep.',
  },
  {
    id: 'four_seven_eight',
    name: '4/7/8/0',
    type: 'fixed',
    inhale: 4,
    inhaleHold: 7,
    exhale: 8,
    exhaleHold: 0,
    breathingTime: 5,
    image: require('../../assets/images/four_seven_eight.jpg'),
    background: require('../../assets/images/four_seven_eight_home.jpg'),
    name_line_one: 'Four seven',
    name_line_two: 'Eight',
    description:
      'Fixed interval breathing exercise known as the "Relaxing Breath". Note this can be tougher for beginners',
  },

  {
    id: 'box',
    name: 'Box',
    type: 'fixed',
    inhale: 4,
    inhaleHold: 4,
    exhale: 4,
    exhaleHold: 4,
    breathingTime: 5,
    image: require('../../assets/images/box_breath.jpg'),
    background: require('../../assets/images/box_breath_home.jpg'),
    name_line_one: 'Box',
    name_line_two: 'Breath',
    description:
      'Fixed interval breathing popularized by the Navy SEALS. Produces focus and calm',
  },
];

export const BREATHING_TIME = {
  calm: {
    id: 'calm',
    min: 1,
    max: 30,
    interval: 1,
  },
  prepare_for_sleep: {
    id: 'prepare_for_sleep',
    min: 5,
    max: 30,
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
  four_seven_eight: {
    id: 'four_seven_eight',
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
    min: 1,
    max: 10,
    interval: 0.5,
  },
  custom_inhale_hold: {
    id: 'custom_inhale_hold',
    min: 0,
    max: 5,
    interval: 1,
  },
  custom_exhale: {
    id: 'custom_exhale',
    min: 1,
    max: 10,
    interval: 0.5,
  },
  custom_exhale_hold: {
    id: 'custom_exhale_hold',
    min: 0,
    max: 5,
    interval: 1,
  },
};
