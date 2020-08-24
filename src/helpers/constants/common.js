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

const COURSES = {
  calm: {
    inhaleTime: 4,
    exhaleTime: 4,
    totalBreaths: 10,
  },
  prepare_sleep: {
    inhaleTime: 3,
    exhaleTime: 6,
    totalBreaths: 20,
  },
};

export {
  ScreenWidth,
  ScreenHeight,
  PickerPlaceHolder,
  hapticFeedbackOptions,
  COURSES,
};
