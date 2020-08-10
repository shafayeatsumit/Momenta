import {Dimensions} from 'react-native';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const PickerPlaceHolder = {
  color: 'white',
  width: 84,
  height: 43,
  fontFamily: 'Montserrat-Regular',
  fontSize: 14,
  paddingLeft: 16,
  borderRadius: 8,
  borderWidth: 0.7,
  borderColor: '#afbec5',
  marginTop: 8,
};

const hapticFeedbackOptions = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: true,
};

const SMOOTH_WORDS = [
  'Slowly',
  'Gently',
  'Softly',
  'Quietly',
  'Smoothly',
  'Lightly',
];

const EXHALE_MESSAGE = [
  'You got this',
  'Nice',
  'Keep going',
  'Just a few more',
  "What's one thing that's going well right now?",
  'Bring to mind a good memory from yesterday',
  'What was carefree today?',
  "What's are you glad you get to do today?",
];

// inhaletime to radius
const START_RADIUSES = {
  3: 4,
  4: 3,
  5: 2,
  6: 1,
};

const RELEASE_MESSAGE = 'Release just after image is revealed';

export {
  ScreenWidth,
  ScreenHeight,
  PickerPlaceHolder,
  SMOOTH_WORDS,
  EXHALE_MESSAGE,
  START_RADIUSES,
  hapticFeedbackOptions,
  RELEASE_MESSAGE,
};
