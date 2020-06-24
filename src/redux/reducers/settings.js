const initialState = {
  inhaleTime: 4, // 4 seconds.
  exhaleTime: 4, // 4 seconds.
  breathingTips: true,
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_EXHALE_TIME':
      return {
        ...state,
        exhaleTime: action.value,
      };
    case 'UPDATE_INHALE_TIME':
      return {
        ...state,
        inhaleTime: action.value,
      };
    case 'TOGGLE_BREATHING_TIPS':
      return {
        ...state,
        breathingTips: !state.breathingTips,
      };
    default:
      return state;
  }
};

export default settings;
