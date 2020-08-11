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

const SMOOTH_WORDS = ['Slowly', 'Gently', 'Lightly'];

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
  2: 5,
  2.5: 4.5,
  3: 4,
  3.5: 3.5,
  4: 3,
  4.5: 2.5,
  5: 2,
  5.5: 1.5,
  6: 1,
};

const RELEASE_MESSAGE = 'Release just after image is revealed';
const RANDOMNESS = [false, false, true];

const InhaleValues = [
  {label: '2s', value: 2},
  {label: '2.5s', value: 2.5},
  {label: '3s', value: 3},
  {label: '3.5s', value: 3.5},
  {label: '4s', value: 4},
  {label: '4.5s', value: 4.5},
  {label: '5s', value: 5},
];

const ExhaleValues = [
  {label: '3s', value: 3},
  {label: '3.5s', value: 35},
  {label: '4s', value: 4},
  {label: '4.5s', value: 4.5},
  {label: '5s', value: 5},
  {label: '5.5s', value: 5.5},
  {label: '6s', value: 6},
];

const BreathNumbers = [
  {label: '3', value: 3},
  {label: '4', value: 4},
  {label: '5', value: 5},
  {label: '6', value: 6},
  {label: '7', value: 7},
  {label: '8', value: 8},
  {label: '9', value: 9},
  {label: '10', value: 10},
];

const AdditionBreathNumbers = [
  {label: '+2', value: 2},
  {label: '+3', value: 3},
  {label: '+4', value: 4},
  {label: '+5', value: 5},
  {label: '+6', value: 6},
  {label: '+7', value: 7},
  {label: '+8', value: 8},
  {label: '+9', value: 9},
  {label: '+10', value: 10},
];

export {
  ScreenWidth,
  ScreenHeight,
  PickerPlaceHolder,
  SMOOTH_WORDS,
  EXHALE_MESSAGE,
  START_RADIUSES,
  hapticFeedbackOptions,
  RELEASE_MESSAGE,
  RANDOMNESS,
  InhaleValues,
  ExhaleValues,
  BreathNumbers,
  AdditionBreathNumbers,
};
