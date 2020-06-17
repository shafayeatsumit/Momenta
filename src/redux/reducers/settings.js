const initialState = {
  selectedTags: [],
  inhaleTime: 4, // 4 seconds.
  exhaleTime: 4, // 4 seconds.
  breathingTips: true,
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case 'INIT_DATA':
      return {
        ...state,
        selectedTags: action.tags,
      };
    default:
      return state;
  }
};

export default settings;
