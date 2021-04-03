import { Dimensions } from 'react-native';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const hapticFeedbackOptions = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: true,
};

export { ScreenWidth, ScreenHeight, hapticFeedbackOptions };

export const ExercisesRhythm = {
  'calmer': {
    'slower': { inhaleTime: 5, exhaleTime: 5, breathsPerMin: 6 },
    'standard': { inhaleTime: 3.75, exhaleTime: 3.75, breathsPerMin: 8 },
    'faster': { inhaleTime: 3, exhaleTime: 3, breathsPerMin: 10 },
  },
  'relax': {
    'slower': { inhaleTime: 5, exhaleTime: 10, breathsPerMin: 4 },
    'standard': { inhaleTime: 3.33, exhaleTime: 6.67, breathsPerMin: 6 },
    'faster': { inhaleTime: 2.5, exhaleTime: 5, breathsPerMin: 8 },
  },
  'box': {
    'standard': { inhaleTime: 4, exhaleTime: 4, inhaleHoldTime: 4, exhaleHoldTime: 4, breathsPerMin: 4 },
    'easier': { inhaleTime: 3, exhaleTime: 3, inhaleHoldTime: 3, exhaleHoldTime: 3, breathsPerMin: 5 },
    'easiest': { inhaleTime: 2.5, exhaleTime: 2.5, inhaleHoldTime: 2.5, exhaleHoldTime: 2.5, breathsPerMin: 6 },
  },
  '4 7 8': {
    'standard': { inhaleTime: 4, exhaleTime: 7, inhaleHoldTime: 8, exhaleHoldTime: 0, breathsPerMin: 3 },
    'easier': { inhaleTime: 3.5, exhaleTime: 5, inhaleHoldTime: 6.5, exhaleHoldTime: 0, breathsPerMin: 4 },
    'easiest': { inhaleTime: 3, exhaleTime: 4, inhaleHoldTime: 5, exhaleHoldTime: 0, breathsPerMin: 5 },
  }
}

export const LottieFiles = {
  'calmer': require('../../assets/anims/calmer.json'),
  'box': require('../../assets/anims/box.json'),
  'relax': require('../../assets/anims/relax.json'),
  '4 7 8': require('../../assets/anims/478.json'),
}