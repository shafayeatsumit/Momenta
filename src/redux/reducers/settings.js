const initialState = {
  inhaleTime: 4, // 4 seconds.
  exhaleTime: 4, // 4 seconds.
  breathPerSession: 3,
  selectedTags: [],
  todaysFocusOn: true,
};

const settings = (state = initialState, action) => {
  switch (action.type) {
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
    case 'UPDATE_BREATH_PER_SESSION':
      return {
        ...state,
        breathPerSession: action.breathCount,
      };
    case 'UPDATE_INHALE_EXHALE_TIME':
      return {
        ...state,
        inhaleTime: action.inhaleValue,
        exhaleTime: action.exhaleValue,
      };
    case 'DONT_SHOW_FOCUS_TODAY':
      return {
        ...state,
        todaysFocusOn: !state.todaysFocusOn,
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
