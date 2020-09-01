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
    numberOfBreaths: 10,
    targetInhale: 4,
    targetExhale: 4,
    multiLevel: false,
  },
  deep_calm: {
    id: 'deep_calm',
    targetInhale: 5,
    targetExhale: 5,
    multiLevel: false,
    numberOfBreaths: 25,
  },
  prepare_for_sleep: {
    id: 'prepare_for_sleep',
    targetInhale: 3,
    targetExhale: 7,
    multiLevel: false,
    numberOfBreaths: 25,
  },
  inner_quiet: {
    id: 'inner_quiet',
    targetInhale: 3,
    targetExhale: 6,
    multiLevel: true,
    numberOfBreaths: 25,
    targetInhaleNext: 4,
    targetExhaleNext: 4,
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
  {id: 'deep_calm', name: 'Deep Calm'},
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
