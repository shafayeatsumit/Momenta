const initialState = {
  breathCountToday: 0, // 4 seconds.
  lastBreathTaken: 4, // 4 seconds.
  breathingTips: [],
};

const breathing = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_BREATH_COUNT':
      return {
        ...state,
        selectedTags: action.selectedTags,
      };
    default:
      return state;
  }
};

export default breathing;
