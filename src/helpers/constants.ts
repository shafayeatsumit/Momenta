import { Dimensions } from 'react-native';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const hapticFeedbackOptions = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: true,
};

export { ScreenWidth, ScreenHeight, hapticFeedbackOptions };

export const ExercisesRhythm = {
  'calm': {
    'standard': { inhaleTime: 5, exhaleTime: 5, breathsPerMin: 6 },
    'faster': { inhaleTime: 4, exhaleTime: 4, breathsPerMin: 8 },
    'slower': { inhaleTime: 3, exhaleTime: 3, breathsPerMin: 10 },
  },
  'box': {
    'standard': { inhaleTime: 4, exhaleTime: 4, inhaleHoldTime: 4, exhaleHoldTime: 4, breathsPerMin: 4 },
    'faster': { inhaleTime: 3, exhaleTime: 3, inhaleHoldTime: 3, exhaleHoldTime: 3, breathsPerMin: 5 },
    'slower': { inhaleTime: 2, exhaleTime: 2, inhaleHoldTime: 2, exhaleHoldTime: 2, breathsPerMin: 6 },
  }
}
