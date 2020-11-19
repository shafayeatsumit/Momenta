const INIT_STATE = {
  token: null,
  email: null,
  userId: null,
  name: null,
  soundOn: true,
  onboarded: false,
  calm_sound: true,
  calm_vibration: true,
  prepare_for_sleep_sound: true,
  prepare_for_sleep_vibration: true,
  box_sound: true,
  box_vibration: true,
  four_seven_eight_sound: true,
  four_seven_eight_vibration: true,
  showExerciseExplainer: true,
  showCalibrationExplainer: true,
  signedUpCalmerBreathingLessons: false,
  mindfulChallengeStreak: 0,
  mindfulChallengeDate: null,
};

const loginInfo = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'ADD_USER_DATA':
      const {token, email, name, id: userId} = action.data;
      return {
        ...state,
        token,
        email,
        name,
        userId,
      };
    case 'TOGGLE_SOUND':
      const soundName = action.name;
      return {
        ...state,
        [soundName]: !state[soundName],
      };
    case 'TOGGLE_VIBRATION':
      const vibrationName = action.name;
      return {
        ...state,
        [vibrationName]: !state[vibrationName],
      };
    case 'HIDE_EXERCISE_EXPLAINER':
      return {
        ...state,
        showExerciseExplainer: false,
      };
    case 'HIDE_CALIBRATION_EXPLAINER':
      return {
        ...state,
        showCalibrationExplainer: false,
      };
    case 'SIGNED_UP_CALMER_BREATHING_LESSONS':
      return {
        ...state,
        signedUpCalmerBreathingLessons: true,
      };
    case 'RESET_MINDFUL_CHALLENGE_STREAK':
      return {
        ...state,
        mindfulChallengeStreak: 0,
      };
    case 'UPDATE_MINDFUL_CHALLENGE_STREAK':
      return {
        ...state,
        mindfulChallengeStreak: state.mindfulChallengeStreak + 1,
        mindfulChallengeDate: action.updateDate,
      };
    default:
      return state;
  }
};

export default loginInfo;
