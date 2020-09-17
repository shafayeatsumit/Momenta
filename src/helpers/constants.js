import {Dimensions} from 'react-native';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const hapticFeedbackOptions = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: true,
};

const guidedBreathingProperties = {
  calm: {
    id: 'calm',
    numberOfBreaths: 2,
    minNumberOfBreaths: 2,
    targetInhale: 3.5,
    targetExhale: 3.5,
    firstThreshold: 120,
    secondThreshold: 0,
    secondTargetInhale: 0,
    secondTargetExhale: 0,
  },
  relaxed: {
    id: 'relaxed',
    numberOfBreaths: 5,
    minNumberOfBreaths: 5,
    targetInhale: 5,
    targetExhale: 5,
    firstThreshold: 300,
    secondThreshold: 0,
    secondTargetInhale: 0,
    secondTargetExhale: 0,
  },
  prepare_for_sleep: {
    id: 'prepare_for_sleep',
    targetInhale: 3,
    targetExhale: 6,
    numberOfBreaths: 10,
    minNumberOfBreaths: 10,
    firstThreshold: 600,
    secondThreshold: 0,
    secondTargetInhale: 0,
    secondTargetExhale: 0,
  },
  inner_quiet: {
    id: 'inner_quiet',
    targetInhale: 3,
    targetExhale: 6,
    numberOfBreaths: 1,
    minNumberOfBreaths: 1,
    firstThreshold: 30,
    secondThreshold: 120,
    secondTargetInhale: 3.5,
    secondTargetExhale: 3.5,
  },
};

const fixedBreathingProperties = {
  beginner_box: {
    id: 'beginner_box',
    name: 'Beginner Box',
    inhale: 2,
    inhaleHold: 2,
    exhale: 2,
    exhaleHold: 2,
  },
  box: {
    id: 'box',
    name: 'Box',
    inhale: 4,
    inhaleHold: 4,
    exhale: 4,
    exhaleHold: 4,
  },
  '4-7-8': {
    id: '4-7-8',
    name: '4/7/8/0',
    inhale: 4,
    inhaleHold: 7,
    exhale: 8,
    exhaleHold: 0,
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    inhale: 3,
    inhaleHold: 3,
    exhale: 3,
    exhaleHold: 3,
  },
};

const GUIDED_BREATHINGS = [
  {id: 'calm', name: 'Calm'},
  {id: 'relaxed', name: 'Relaxed'},
  {id: 'inner_quiet', name: 'Inner Quiet'},
  {id: 'prepare_for_sleep', name: 'Prepare For Sleep'},
];

const FIXED_BREATHINGS = [
  {id: 'beginner_box', name: 'Beginner Box'},
  {id: 'box', name: 'Box'},
  {id: '4-7-8', name: '4/7/8/0'},
  {id: 'custom', name: 'Custom'},
];

export {
  ScreenWidth,
  ScreenHeight,
  GUIDED_BREATHINGS,
  FIXED_BREATHINGS,
  hapticFeedbackOptions,
  fixedBreathingProperties,
  guidedBreathingProperties,
};
