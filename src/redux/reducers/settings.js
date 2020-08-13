const initialState = {
  inhaleTime: 2.5, // 2.5 seconds.
  exhaleTime: 3, // 3 seconds.
  breathPerSession: 3,
  selectedTags: [],
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
    case 'PICK_BREATH_PER_SESSION':
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
