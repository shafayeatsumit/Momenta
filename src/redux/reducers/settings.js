const initialState = {
  inhaleTime: 4, // 4 seconds.
  exhaleTime: 4, // 4 seconds.
  breathingTip: true,
  selectedTags: [],
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case 'INITIAL_DATA':
      return {
        ...state,
        selectedTags: [...action.selectedTags],
      };
    case 'UPDATE_SELECTED_TAGS':
      return {
        ...state,
        selectedTags: action.selectedTags,
      };
    case 'UPDATE_EXHALE_TIME':
      return {
        ...state,
        exhaleTime: action.value,
      };
    case 'UPDATE_INHALE_EXHALE_TIME':
      return {
        ...state,
        inhaleTime: action.inhaleValue,
        exhaleTime: action.exhaleValue,
      };
    case 'TOGGLE_BREATHING_TIP':
      return {
        ...state,
        breathingTip: !state.breathingTip,
      };
    case 'UPDATE_INHALE_TIME':
      return {
        ...state,
        inhaleTime: action.value,
      };
    default:
      return state;
  }
};

export default settings;
