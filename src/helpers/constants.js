import {Dimensions} from 'react-native';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const hapticFeedbackOptions = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: true,
};

const GUIDED_BREATHINGS = [
  {id: 'calm', name: 'Calm'},
  {id: 'deep_calm', name: 'Deep Calm'},
  {id: 'inner_quiet', name: 'Inner Quiet'},
  {id: 'prepare_for_sleep', name: 'Prepare For Sleep'},
];

export {ScreenWidth, ScreenHeight, GUIDED_BREATHINGS, hapticFeedbackOptions};
